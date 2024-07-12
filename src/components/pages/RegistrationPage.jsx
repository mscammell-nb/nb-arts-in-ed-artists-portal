import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "../ui/password-input";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// TODO: might need to include the Controller
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddOrUpdateRecordMutation } from "@/redux/api/quickbaseApi";
import { states, websiteRegex } from "@/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const performerSchema = yup.object().shape({
  firstName: yup.string().required("Performer first name is required"),
  middleInitial: yup.string().notRequired(),
  lastName: yup.string().required("Performer last name is required"),
  stageName: yup.string().notRequired(),
});

const schema = yup.object({
  artistOrg: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required(),
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
    .matches(websiteRegex, "Invalid website format")
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
  state: yup.string().oneOf(states, "Invalid state").required(),
  zipCode: yup
    .number()
    .typeError("Zip code must be a number")
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : value,
    )
    .required("zip code is a required field"),
  performers: yup
    .array()
    .of(performerSchema)
    .min(1, "At least one performer is required"),
});

const RegistrationPage = () => {
  const [
    registerUser,
    {
      data: registerUserData,
      isLoading: isRegisterUserLoading,
      isSuccess: isRegisterUserSuccess,
      isError: isRegisterUserError,
      error: registerUserError,
    },
  ] = useRegisterUserMutation();
  const [
    addArtist,
    {
      data: addArtistData,
      isLoading: isAddArtistLoading,
      isSuccess: isAddArtistSuccess,
      isError: isAddArtistError,
      error: addArtistError,
    },
  ] = useAddOrUpdateRecordMutation();
  const [
    addArtistRegistration,
    {
      data: addArtistRegistrationData,
      isLoading: isAddArtistRegistrationLoading,
      isSuccess: isAddArtistRegistrationSuccess,
      isError: isAddArtistRegistrationError,
      error: addArtistRegistrationError,
    },
  ] = useAddOrUpdateRecordMutation();

  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      artistOrg: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      altPhone: "",
      website: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      performers: [
        { firstName: "", middleInitial: "", lastName: "", stageName: "" },
      ],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "performers",
  });

  const formatDataForTheArtistTable = (data, userUid) => {
    const body = {
      to: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
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
      fieldsToReturn: [3],
    };

    if (data.altPhone !== null) {
      body.data[0][11] = { value: data.altPhone };
    }

    if (data.street2 !== null) {
      body.data[0][14] = { value: data.street2 };
    }

    if (data.website !== null) {
      body.data[0][31] = { value: data.website };
    }

    return body;
  };

  const formatDataForTheArtistRegistrationTable = (
    data,
    artistRecordId,
    userUid,
  ) => {
    const body = {
      to: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
      data: [
        {
          7: {
            value: artistRecordId,
          },
          9: {
            value: data.email,
          },
          10: {
            value: data.password,
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

    return body;
  };

  const onSubmit = async (data) => {
    console.log(data);
    // const firebaseResponse = await registerUser(data);
    // const { userUid } = firebaseResponse.data;
    // const response = await addArtist(
    //   formatDataForTheArtistTable(data, userUid),
    // );
    // const artistRecordId = response.data.data[0][3].value;
    // addArtistRegistration(
    //   formatDataForTheArtistRegistrationTable(data, artistRecordId, userUid),
    //   artistRecordId,
    // );
    // form.reset();
  };

  useEffect(() => {
    if (
      isRegisterUserSuccess &&
      registerUserData &&
      isAddArtistSuccess &&
      addArtistData &&
      isAddArtistRegistrationSuccess &&
      addArtistRegistrationData
    ) {
      const { userUid, authToken } = registerUserData;
      localStorage.setItem("userUid", userUid);
      localStorage.setItem("authToken", authToken);
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "Your account has been created.",
      });
      navigate("/dashboard");
    }

    if (
      (isRegisterUserError && registerUserError) ||
      (isAddArtistError && addArtistError) ||
      (isAddArtistRegistrationError && addArtistRegistrationError)
    ) {
      let errorTitle = "Uh oh! Something went wrong.";
      let errorMessage;

      if (registerUserError) {
        errorTitle = "Firebase Authentication error";
        errorMessage = registerUserError.data.code;
        console.log("registerUserError: ", registerUserError);
      } else if (addArtistError) {
        console.log("addArtistError: ", addArtistError);
        errorTitle = "Error adding data to the Artists table";
        const { message, description } = addArtistError.data;
        errorMessage = `${message}: ${description}`;
      } else if (addArtistRegistrationError) {
        console.log("addArtistRegistrationError: ", addArtistRegistrationError);
        errorTitle = "Error adding data to the ArtistRegistrations table";
        const { message, description } = addArtistRegistrationError.data;
        errorMessage = `${message}: ${description}`;
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });
    }
  }, [
    isRegisterUserSuccess,
    isAddArtistSuccess,
    isAddArtistRegistrationSuccess,
    registerUserData,
    addArtistData,
    addArtistRegistrationData,
    isRegisterUserError,
    isAddArtistError,
    isAddArtistRegistrationError,
    registerUserError,
    addArtistError,
    addArtistRegistrationError,
    toast,
  ]);

  const isRequestLoading = () =>
    isRegisterUserLoading ||
    isAddArtistLoading ||
    isAddArtistRegistrationLoading;

  return (
    <div className="flex w-full justify-center py-16">
      {/* TODO: Adjust the max width */}
      <Card className="max-w- w-full">
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
                      <Input {...field} placeholder="Artist / Organization" />
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
                      <Input {...field} placeholder="Email" />
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
                      <PasswordInput {...field} placeholder="Password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm password<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Confirm password"
                      />
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
                        {states.map((state) => (
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

              {/* Performers Section */}

              {fields.map((item, index) => (
                <div key={item.id}>
                  <FormField
                    control={form.control}
                    name={`performers.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Performer first name
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Performer first name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`performers.${index}.middleInitial`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Performer middle initial</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Performer's middle initial"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`performers.${index}.lastName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Performer last name
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Performer last name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`performers.${index}.stageName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Performer stage name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Performer's stage name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    onClick={() => remove(index)}
                    variant="destructive"
                    type="button"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  append({
                    firstName: "",
                    middleInitial: "",
                    lastName: "",
                    stageName: "",
                  })
                }
              >
                Add Performer
              </Button>

              <Button
                type="submit"
                variant="bocesPrimary"
                className="mt-7 w-full"
                isLoading={isRequestLoading()}
              >
                Sign up
              </Button>
            </form>
            <div className="pt-2 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Login
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPage;
