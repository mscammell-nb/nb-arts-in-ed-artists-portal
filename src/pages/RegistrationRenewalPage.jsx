import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import {
  useQueryForDataQuery,
  useAddOrUpdateRecordMutation,
} from "@/redux/api/quickbaseApi";
import { parsePhoneNumber } from "@/utils/parsePhoneNumber";
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
import Spinner from "../components/ui/Spinner";
import { STATES } from "@/constants/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VALID_WEBSITE_URL_REGEX } from "@/constants/constants";

const schema = yup.object({
  artistOrg: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required(),
  altPhone: yup
    .string()
    .nullable()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    ),
  website: yup
    .string()
    .nullable()
    .matches(VALID_WEBSITE_URL_REGEX, "Invalid website format")
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
  state: yup.string().oneOf(STATES, "Invalid state").required(),
  zipCode: yup
    .number()
    .typeError("Zip code must be a number")
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : value,
    )
    .required("zip code is a required field"),
});

const RegistrationRenewalPage = () => {
  const userUid = localStorage.getItem("userUid");

  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    data: artistData,
    isError: isArtistDataError,
    error: artistDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
    select: [3, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17, 31],
    where: `{10.EX.${userUid}}`,
  });
  const [
    addOrupdateRecord,
    {
      data: newArtistRegistrationData,
      isLoading: isNewArtistRegistrationLoading,
      isSuccess: isNewArtistRegistrationSuccess,
      isError: isNewArtistRegistrationError,
      error: newArtistRegistrationError,
    },
  ] = useAddOrUpdateRecordMutation();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      artistOrg: "",
      email: "",
      phone: "",
      altPhone: "",
      website: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const { reset, setValue } = form;

  useEffect(() => {
    if (artistData) {
      const data = artistData.data[0];
      console.log("data: ", data);
      const defaultValues = {
        artistOrg: data[6].value,
        email: data[7].value,
        phone: parsePhoneNumber(data[9].value),
        altPhone: parsePhoneNumber(data[11].value),
        website: data[31].value,
        street1: data[13].value,
        street2: data[14].value,
        city: data[15].value,
        state: data[16].value,
        zipCode: data[17].value,
      };
      reset(defaultValues);
      setValue("state", data[16].value);
    }
  }, [artistData, reset, setValue]);

  const formatDataForQuickbase = (data) => {
    const body = {
      to: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
      data: [
        {
          7: {
            value: artistData.data[0][3].value,
          },
          9: {
            value: artistData.data[0][7].value,
          },
          10: {
            value: artistData.data[0][8].value,
          },
          11: {
            value: data.phone,
          },
          13: {
            value: userUid,
          },
          15: {
            value: data.street1,
          },
          17: {
            value: data.city,
          },
          18: {
            value: data.state,
          },
          19: {
            value: data.zipCode,
          },
          20: {
            value: "United States",
          },
        },
      ],
    };

    if (data.altPhone !== null) {
      body.data[0][12] = { value: data.altPhone };
    }

    if (data.street2 !== null) {
      body.data[0][16] = { value: data.street2 };
    }

    if (data.website !== null) {
      body.data[0][23] = { value: data.website };
    }

    return body;
  };

  useEffect(() => {
    if (isNewArtistRegistrationSuccess && newArtistRegistrationData) {
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "New registration created.",
      });
      navigate("/dashboard");
    }

    if (isNewArtistRegistrationError && newArtistRegistrationError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: newArtistRegistrationError.data.code,
      });
      navigate("/dashboard");
    }
  }, [
    isNewArtistRegistrationSuccess,
    isNewArtistRegistrationError,
    newArtistRegistrationError,
    toast,
  ]);

  const onSubmit = (data) => {
    addOrupdateRecord(formatDataForQuickbase(data));
  };

  if (!artistData && !isArtistDataError)
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );

  if (isArtistDataError && artistDataError) {
    console.log("User Data Error: ", artistDataError);
    return (
      <div className="flex w-full justify-center pt-24">
        <p className="text-xl font-semibold text-destructive">
          An error occurred while obtaining the user's data.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Registration Renewal</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="artistOrg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist / Organization</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Artist / Organization"
                        disabled
                      />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" disabled />
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
                      <Input {...field} placeholder="e.g. 6312890915" />
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
                      <Input {...field} placeholder="e.g. 6312890915" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Website" />
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
                      <Input {...field} placeholder="Street 1" />
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
                      <Input {...field} placeholder="Street 2" />
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
                      <Input {...field} placeholder="City" />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input {...field} placeholder="Zip code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="bocesPrimary"
                className="mt-7 w-full"
                disabled={isNewArtistRegistrationLoading}
              >
                {isNewArtistRegistrationLoading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isNewArtistRegistrationLoading ? "Please wait" : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationRenewalPage;
