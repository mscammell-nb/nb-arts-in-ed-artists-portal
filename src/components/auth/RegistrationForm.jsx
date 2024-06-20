import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "../ui/password-input";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { formatAuthErrorMessage } from "@/utils/functionUtils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddArtistMutation } from "@/redux/api/artistsApi";

const schema = yup.object({
  artistOrg: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  phone: yup.number().required(),
  altPhone: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    ),
  street1: yup.string().required(),
  street2: yup
    .string()
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    ),
  city: yup.string().required(),
  state: yup.string().required(),
  zipCode: yup.number().required(),
});

// TODO: make yup schema validation more complex

const RegistrationForm = () => {
  const [registerUser, { data, isLoading, isSuccess, isError, error }] =
    useRegisterUserMutation();
  const [
    addArtist,
    {
      data: addArtistData,
      isLoading: isAddArtistLoading,
      isSuccess: isAddArtistSuccess,
      isError: isAddArtistError,
      error: addArtistError,
    },
  ] = useAddArtistMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      artistOrg: "",
      email: "",
      password: "",
      phone: "",
      altPhone: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const formatDataForQuickbase = (data, userUid) => {
    const body = {
      to: "bt9t5shi6", // TODO: move this to a .ENV file
      data: [
        {
          6: {
            value: data.artistOrg,
          },
          7: {
            value: data.email,
          },
          8: {
            value: data.password,
          },
          9: {
            value: data.phone,
          },
          10: {
            value: userUid,
          },
          13: {
            value: data.street1,
          },
          15: {
            value: data.city,
          },
          16: {
            value: data.state,
          },
          17: {
            value: data.zipCode,
          },
          18: {
            value: "United States",
          },
        },
      ],
    };

    if (data.altPhone !== null) {
      body.data[0][11] = data.altPhone;
    }

    if (data.street2 !== null) {
      body.data[0][14] = data.street2;
    }

    return body;
  };

  const onSubmit = async (data) => {
    console.log(data);
    const registerUserResponse = await registerUser(data);
    console.log("registerUserResponse: ", registerUserResponse);
    const { userUid } = registerUserResponse.data;
    const addArtistResponse = await addArtist(
      formatDataForQuickbase(data, userUid),
    );
    console.log("addArtistResponse: ", addArtistResponse);
    form.reset();
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "Your account has been created.",
      });
      navigate("/dashboard");
    }

    if (isError && error) {
      console.log("error: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${formatAuthErrorMessage(error.data.code)}`,
      });
    }
  }, [isSuccess, data, isError, error, toast]);

  return (
    <div className="flex w-full justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your credentials below to create an account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="artistOrg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Artist / Organization
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="altPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Street 1<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street 2</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      State<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Zip code<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="bocesPrimary"
                className="mt-7 w-full"
                disabled={isLoading}
              >
                {isLoading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "Please wait" : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
