import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/use-toast";
import { STATES, VALID_WEBSITE_URL_REGEX } from "@/constants/constants";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { setArtist, signUp } from "@/redux/slices/authSlice";
import { capitalizeString, getCutoffFiscalYearKey } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Steps from "../components/Steps";
import { PasswordInput } from "../components/ui/password-input";

const STEP_TITLES = [
  "Personal Information",
  "Address Information",
  "Add Performers",
];

const STEP_DESCRIPTIONS = [
  "Enter your personal information and click finish to move to the next step.",
  "Enter your address information and click finish to move to the next step.",
  "Enter the information of all your performers and click finish to register. You can add more performers later.",
];

const performerSchema = yup.object().shape({
  firstName: yup.string().required("Performer first name is required"),
  middleInitial: yup.string().notRequired(),
  lastName: yup.string().required("Performer last name is required"),
  stageName: yup.string().notRequired(),
});

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const [formStep, setFormStep] = useState(0);

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
  const [
    addPerformers,
    {
      data: addPerformersData,
      isLoading: isAddPerformersLoading,
      isSuccess: isAddPerformersSuccess,
      isError: isAddPerformersError,
      error: addPerformersError,
    },
  ] = useAddOrUpdateRecordMutation();

  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    data: masterData,
    isLoading: isMasterDataLoading,
    isError: isMasterDataError,
    error: masterDataError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_MASTER_TABLE_ID,
    select: [6, 9],
  });

  const getCurrentStepSchema = () => {
    switch (formStep) {
      case 0:
        return yup.object({
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
            .matches(VALID_WEBSITE_URL_REGEX, "Invalid website format")
            .transform((value, originalValue) =>
              String(originalValue).trim() === "" ? null : value,
            ),
        });
      case 1:
        return yup.object({
          street1: yup.string().required(),
          city: yup.string().required(),
          state: yup.string().oneOf(STATES, "Invalid state").required(),
          zipCode: yup
            .number()
            .typeError("Zip code must be a number")
            .required("zip code is a required field"),
        });
      case 2:
        return yup.object({
          performers: yup
            .array()
            .of(performerSchema)
            .min(1, "At least one performer is required"),
        });
      default:
        return yup.object();
    }
  };

  const form = useForm({
    resolver: yupResolver(getCurrentStepSchema()),
    mode: "all",
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

  const {
    control,
    handleSubmit,
    trigger,
    formState: { isValid, errors, isDirty },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "performers",
  });

  const formatDataForTheArtistTable = (data, uid) => {
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
          9: {
            value: data.phone,
          },
          10: {
            value: uid,
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

  useEffect(() => {
    if (
      isAddArtistSuccess &&
      addArtistData &&
      isAddArtistRegistrationSuccess &&
      addArtistRegistrationData &&
      isAddPerformersSuccess &&
      addPerformersData
    ) {
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "Your account has been created.",
      });
      navigate("/file-upload");
    }

    if (
      (isAddArtistError && addArtistError) ||
      (isAddArtistRegistrationError && addArtistRegistrationError) ||
      (isAddPerformersError && addPerformersError)
    ) {
      let errorTitle = "Uh oh! Something went wrong.";
      let errorMessage;

      if (addArtistError) {
        console.log("addArtistError: ", addArtistError);
        errorTitle = "Error adding data to the Artists table";
        const { message, description } = addArtistError.data;
        errorMessage = `${message}: ${description}`;
      } else if (addArtistRegistrationError) {
        console.log("addArtistRegistrationError: ", addArtistRegistrationError);
        errorTitle = "Error adding data to the ArtistRegistrations table";
        errorMessage = addArtistRegistrationError.error;
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });
    }
  }, [
    isAddArtistSuccess,
    isAddArtistRegistrationSuccess,
    addArtistData,
    addArtistRegistrationData,
    isAddArtistError,
    isAddArtistRegistrationError,
    addArtistError,
    addArtistRegistrationError,
    isAddPerformersSuccess,
    addPerformersData,
    addPerformersError,
    toast,
  ]);

  useEffect(() => {
    trigger();
  }, [formStep]);

  if (isMasterDataLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const cutoffMonth = new Date(masterData.data[0][6].value).getMonth();
  const cutoffDay = new Date(masterData.data[0][6].value).getDate() + 1;
  const fiscalYearKey = getCutoffFiscalYearKey(cutoffMonth, cutoffDay);

  const formatDataForTheArtistRegistrationTable = (
    data,
    artistRecordId,
    uid,
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
            value: uid,
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
          24: {
            value: fiscalYearKey,
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

  const formatDataForThePerformersTable = (data, artistRecordId) => {
    const body = {
      to: import.meta.env.VITE_QUICKBASE_PERFORMERS_TABLE_ID,
      data: data.performers.map((performer) => {
        const performerData = {
          7: {
            value: capitalizeString(performer.firstName.trim()),
          },
          8: {
            value: capitalizeString(performer.lastName.trim()),
          },
          12: {
            value: fiscalYearKey,
          },
          14: {
            value: artistRecordId,
          },
        };

        if (performer.stageName !== null) {
          performerData[22] = { value: performer.stageName };
        }

        if (performer.middleInitial !== null) {
          performerData[23] = { value: performer.middleInitial };
        }

        return performerData;
      }),
    };

    return body;
  };

  const renderFormButton = () => {
    if (formStep < 0) {
      return;
    } else if (formStep < 2) {
      return (
        <Button
          onClick={(event) => {
            event.preventDefault();
            setFormStep((prev) => prev + 1);
          }}
          disabled={!isValid}
          type="button"
        >
          Next
        </Button>
      );
    } else if (formStep === 2) {
      return (
        <Button
          disabled={!isValid || isRequestLoading()}
          isLoading={isRequestLoading()}
          type="submit"
        >
          Finish
        </Button>
      );
    }
  };

  const isRequestLoading = () =>
    isAddArtistLoading ||
    isAddArtistRegistrationLoading ||
    isAddPerformersLoading;

  const onSubmit = async (data) => {
    let uid;
    await dispatch(signUp({ email: data.email, password: data.password }))
      .then(async (res) => {
        if (signUp.fulfilled.match(res)) {
          uid = res.payload.uid;
          const response = await addArtist(
            formatDataForTheArtistTable(data, uid),
          );
          const artistRecordId = response.data.data[0][3].value;
          dispatch(
            setArtist({
              artistOrg: response.data.data[0][6].value,
              artistRecordId,
            }),
          );

          addArtistRegistration(
            formatDataForTheArtistRegistrationTable(data, artistRecordId, uid),
            artistRecordId,
          );

          addPerformers(formatDataForThePerformersTable(data, artistRecordId));
          return null;
        }
        return null;
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 py-8">
      <Steps stepTitles={STEP_TITLES} formStep={formStep} />
      <Card className="w-full max-w-[950px]">
        <CardHeader>
          <CardTitle className="text-2xl">{STEP_TITLES[formStep]}</CardTitle>
          <CardDescription>{STEP_DESCRIPTIONS[formStep]}</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {formStep >= 0 && (
                <section
                  className={
                    formStep === 0 ? "grid gap-5 sm:grid-cols-2" : "hidden"
                  }
                >
                  <FormField
                    control={control}
                    name="artistOrg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Artist / Organization
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Artist / Organization"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
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
                    control={control}
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
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Confirm password
                          <span className="text-red-600">*</span>
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
                    control={control}
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
                    control={control}
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
                    control={control}
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
                </section>
              )}

              {formStep >= 1 && (
                <section
                  className={
                    formStep === 1 ? "grid gap-5 sm:grid-cols-2" : "hidden"
                  }
                >
                  <FormField
                    control={control}
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
                    control={control}
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
                    control={control}
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
                    control={control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          State<span className="text-red-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                    control={control}
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
                </section>
              )}

              {formStep >= 2 && (
                <section hidden={formStep !== 2}>
                  {fields.map((item, index) => (
                    <div
                      key={item.id}
                      className="my-6 items-start gap-4 lg:flex"
                    >
                      <FormField
                        control={control}
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
                        control={control}
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
                        control={control}
                        name={`performers.${index}.lastName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Performer last name
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Performer last name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
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
                        onClick={(event) => {
                          event.preventDefault();
                          remove(index);
                        }}
                        variant="destructive"
                        type="button"
                        size="sm"
                        className="mt-3 flex gap-1 self-end lg:mt-0"
                      >
                        <Trash2 size="16px" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    disabled={!isValid}
                    onClick={() =>
                      append({
                        firstName: "",
                        middleInitial: "",
                        lastName: "",
                        stageName: "",
                      })
                    }
                    className="flex gap-1"
                  >
                    <Plus size="16px" strokeWidth="3px" />
                    Add Performer
                  </Button>
                </section>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setFormStep((prev) => prev - 1);
                  }}
                  variant="secondary"
                  disabled={formStep < 1}
                  type="button"
                >
                  Prev
                </Button>
                {renderFormButton()}
              </div>
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
