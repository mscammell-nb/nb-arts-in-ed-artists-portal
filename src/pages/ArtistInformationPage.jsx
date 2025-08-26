import DataGrid from "@/components/data-grid/data-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Spinner from "@/components/ui/Spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { STATES, VALID_WEBSITE_URL_REGEX } from "@/constants/constants";
import { ALL_DISTRICTS } from "@/constants/districts";
import { auth } from "@/firebaseConfig";
import { cn } from "@/lib/utils";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { listFirebaseErrors } from "@/utils/listFirebaseErrors";
import { referencesColumns } from "@/utils/TableColumns";
import { getCurrentFiscalYear, parsePhoneNumber } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import {
  AlertCircle,
  CircleAlert,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import "yup-phone-lite";

const ArtistItem = ({ label, value, icon = null, link = false }) => {
  const formatUrl = (url) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <span className="font-secondary text-tertiary block text-sm">
          {label}
        </span>
        {link ? (
          <span className="text-accent hover:underline">
            <a href={formatUrl(value)} target="_blank">
              {value}
            </a>
          </span>
        ) : (
          <span className="text-primary">{value || "-"}</span>
        )}
      </div>
    </div>
  );
};
const AddReference = ({ open, onOpenChange, sheetProps }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} {...sheetProps}>
      <SheetContent className="min-w-[30%]">
        <SheetHeader>
          <SheetTitle>{sheetProps.title}</SheetTitle>
          <SheetDescription>
            Please fill out the form to add a new reference
          </SheetDescription>
          <AddReferenceForm
            sheetProps={sheetProps}
            onOpenChange={onOpenChange}
          />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
const referenceSchema = yup.object({
  firstName: yup.string().required("Reference name is required"),
  lastName: yup.string().required("Reference name is required"),
  referenceEmail: yup.string().email().required("Reference email is required"),
  referencePhone: yup
    .string()
    .phone("US", "Please enter a valid phone number")
    .required("A Phone number is required"),
  jobTitle: yup.string().required("Job title is required"),
  street1: yup.string().required("Address is required"),
  street2: yup.string().notRequired(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zipCode: yup.string().required("Zip code is required"),
  inNassau: yup.boolean().required(),
  district: yup.object().when("inNassau", {
    is: true,
    then: (schema) =>
      schema
        .shape({
          id: yup.number().required("District ID is required"),
          identifier: yup.number().required("District identifier is required"),
          name: yup.string().required("District name is required"),
        })
        .required("District is required when reference is in Nassau"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const AddReferenceForm = ({ sheetProps, onOpenChange }) => {
  const [addReference, { isLoading }] = useAddOrUpdateRecordMutation();
  const referenceForm = useForm({
    resolver: yupResolver(referenceSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      referenceEmail: "",
      referencePhone: "",
      jobTitle: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      inNassau: false,
      district: null,
    },
  });

  // Watch the inNassau field to clear district when unchecked
  const inNassauValue = referenceForm.watch("inNassau");

  const addReferenceSubmit = async (data) => {
    try {
      await addReference({
        to: import.meta.env.VITE_QUICKBASE_REFERENCES_TABLE_ID,
        data: [
          {
            6: {
              value: data.firstName,
            },
            7: {
              value: data.lastName,
            },
            8: {
              value: data.referenceEmail,
            },
            9: {
              value: data.referencePhone,
            },
            12: {
              value: sheetProps.artistRecordId,
            },
            14: {
              value: data.jobTitle,
            },
            15: {
              value: data.inNassau,
            },
            17: {
              value: data.street1,
            },
            18: {
              value: data.street2,
            },
            19: {
              value: data.city,
            },
            20: {
              value: data.state,
            },
            21: {
              value: data.zipCode,
            },
            22: {
              value: "United States",
            },
          },
        ],
      }).then((res) => {
        onOpenChange(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...referenceForm}>
      <form
        onSubmit={referenceForm.handleSubmit(addReferenceSubmit)}
        className="flex w-full flex-col gap-4 text-primary"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField
            control={referenceForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={referenceForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField
            control={referenceForm.control}
            name="referenceEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={referenceForm.control}
            name="referencePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={referenceForm.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Job Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-secondary">Address</h4>

          <FormField
            control={referenceForm.control}
            name="street1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary">Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={referenceForm.control}
            name="street2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary">
                  Street Address 2
                  <span className="text-tertiary ml-1 text-xs">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Apartment, suite, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <FormField
              control={referenceForm.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary">City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={referenceForm.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary">State</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={referenceForm.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary">Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="11801"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* District Checkbox as Form Field */}
        <FormField
          control={referenceForm.control}
          name="inNassau"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    id="inNassau"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (!checked) {
                        referenceForm.setValue("district", null);
                        referenceForm.clearErrors("district");
                      }
                    }}
                  />
                </FormControl>
                <label
                  htmlFor="inNassau"
                  className="text-sm font-medium leading-none text-secondary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Reference is in Nassau
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* District Field - Conditional */}
        {inNassauValue && (
          <FormField
            control={referenceForm.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomSelect
                    data={ALL_DISTRICTS}
                    label={"District"}
                    placeholder="District"
                    value={field.value}
                    setValue={field.onChange}
                    nameOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Submit
        </Button>
      </form>
    </Form>
  );
};

const informationSchema = yup.object({
  artistOrg: yup.string().required("Artist Organization is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  numOfPerformers: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .oneOf(["Less than Five", "Five or More"], "Invalid option"),
  phone: yup
    .string()
    .transform((value, originalValue) => {
      const parsed = parsePhoneNumber(originalValue);
      return parsed === "" ? null : parsed;
    })
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required(),
  altPhone: yup
    .string()
    .transform((value, originalValue) => {
      const parsed = parsePhoneNumber(originalValue);
      return parsed === "" ? null : parsed;
    })
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .notRequired(),
  street1: yup.string().required(),
  street2: yup.string(),
  city: yup.string().required(),
  state: yup.string().oneOf(STATES, "Invalid state").required(),
  zipCode: yup
    .string()
    .matches(/^\d{5}$/, "zip code must be exactly 5 digits")
    .required("zip code is a required field"),
  website: yup
    .string()
    .required()
    .matches(VALID_WEBSITE_URL_REGEX, "Invalid website format")
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    ),
});

const ArtistInformationPage = () => {
  const [editing, setEditing] = useState(false);
  const [artistVal, setArtistVal] = useState("");
  const [performersVal, setPerformersVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [altPhoneVal, setAltPhoneVal] = useState("");
  const [addressVal, setAddressVal] = useState("");
  const [websiteVal, setWebsiteVal] = useState("");
  const [addressObject, setAddressObject] = useState({});
  const [paymentType, setPaymentType] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const { artistRecordId, has3References } = useSelector(
    (state) => state.artist,
  );

  let {
    data: artistData,
    isLoading: isArtistLoading,
    isError: isArtistError,
    error: artistError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
          select: [
            3, 6, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 29, 30, 31, 50, 51,
          ],
          where: `{3.EX.'${artistRecordId}'}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );

  const { data: referencesData, isLoading: isReferencesLoading } =
    useQueryForDataQuery(
      artistRecordId
        ? {
            from: import.meta.env.VITE_QUICKBASE_REFERENCES_TABLE_ID,
            select: [3, 6, 7, 8, 9, 10, 11, 12, 14],
            where: `{12.EX.'${artistRecordId}'}`,
          }
        : { skip: true, refetchOnMountOrArgChange: true },
    );

  const [
    updateArtist,
    {
      isLoading: isUpdateArtistLoading,
      isSuccess: isUpdateArtistSuccess,
      isError: isUpdateArtistError,
      error: updateArtistError,
    },
  ] = useAddOrUpdateRecordMutation();

  const informationForm = useForm({
    resolver: yupResolver(informationSchema),
    defaultValues: {
      artistOrg: "",
      email: "",
      numOfPerformers: "",
      phone: "",
      altPhone: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      website: "",
    },
  });

  const updateArtistSubmit = async (data) => {
    try {
      updateArtist({
        to: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
        data: [
          {
            3: {
              value: registrationData.data[0][3].value,
            },
            21: {
              value: data.numOfPerformers,
            },
            9: {
              value: data.email,
            },
            11: {
              value: data.phone,
            },
            12: {
              value: data.altPhone,
            },
            15: { value: data.street1 },
            16: { value: data.street2 },
            17: { value: data.city },
            18: { value: data.state },
            19: { value: data.zipCode },
            20: {
              value: "United States",
            },
            23: {
              value: data.website,
            },
            36: {
              value: Object.entries(data)
                .reduce((acc, [key, val]) => {
                  const originalVal =
                    artistData.data[0][
                      {
                        numOfPerformers: 19,
                        email: 7,
                        phone: 9,
                        altPhone: 11,
                        street1: 13,
                        street2: 14,
                        city: 15,
                        state: 16,
                        zipCode: 17,
                        website: 31,
                        artistOrg: 6,
                      }[key]
                    ]?.value;

                  if (
                    (!originalVal && val == "") ||
                    (originalVal == "" && !val) ||
                    ((key == "phone" || key == "altPhone") &&
                      parsePhoneNumber(originalVal) == parsePhoneNumber(val))
                  ) {
                    return acc;
                  }

                  if (val !== originalVal) {
                    acc += `${key}: ${originalVal} --> ${val}\n`;
                  }
                  return acc;
                }, "")
                .trim(),
            },
            46:
              data.artistOrg != artistData.data[0][6].value
                ? {
                    value: data.artistOrg,
                  }
                : { value: "" },
          },
        ],
      }).then((res) => {
        setEditing(false);
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const schema = yup.object({
    currentPassword: yup
      .string()
      .required("Missing current password")
      .min(8, "Current Password must be at least 8 characters")
      .max(32, "Current Password must be at most 32 characters"),
    newPassword: yup
      .string()
      .required("Missing new password")
      .min(8, "Current Password must be at least 8 characters")
      .max(32, "Current Password must be at most 32 characters"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "The new password don't match")
      .required("Missing confirmation of new password"),
  });

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await signInWithEmailAndPassword(
          auth,
          user.email,
          data.currentPassword,
        ).then(() => {
          updatePassword(user, data.newPassword)
            .then(() => {
              toast({
                variant: "success",
                title: "Password Updated",
                description: "Your password has been successfully updated.",
              });
              setChangePasswordOpen(false);
              form.reset();
            })
            .catch((error) => {
              toast({
                variant: "destructive",
                title:
                  error.code === "auth/invalid-credential"
                    ? "Incorrect Password"
                    : error.code === "auth/password-does-not-meet-requirements"
                      ? "Password Requirements Not Met"
                      : "Failed Update",
                description:
                  error.code === "auth/invalid-credential"
                    ? "The current password is incorrect."
                    : error.code === "auth/password-does-not-meet-requirements"
                      ? listFirebaseErrors(error.message).map((m) => {
                          return <li>{m}</li>;
                        })
                      : error.message,
              });
            });
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed Update",
          description: error.message,
        });
      }
    }
  };

  // SHOW ARTIST_INFO TABLE BUT UPDATE REGISTRATION
  let {
    data: registrationData,
    isLoading: isRegistrationLoading,
    isError: isRegistrationError,
    error: registrationError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
          select: [
            3, 6, 7, 8, 9, 11, 12, 14, 15, 16, 17, 18, 19, 21, 23, 24, 25, 30,
            31, 36,
          ],
          where: `{7.EX.'${artistRecordId}'} AND {25.EX.'${getCurrentFiscalYear()}'}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (artistData) {
      resetInformation();
    }
  }, [artistData]);

  useEffect(() => {
    if (isUpdateArtistSuccess) {
      toast({
        title: "Operation successful!",
        description: "Request to update information is pending!",
        variant: "success",
      });
    }
    if (isUpdateArtistError) {
      toast({
        title: "There's been an error",
        description: "There was an error updating the artists information.",
        variant: "destructive",
      });
      console.log(updateArtistError);
    }
  }, [updateArtistError, isUpdateArtistSuccess, isUpdateArtistError]);

  const resetInformation = () => {
    const data = artistData.data[0];

    setArtistVal(data[6].value);
    setPerformersVal(data[19].value);
    setEmailVal(data[7].value);
    setPhoneVal(data[9].value);
    setAltPhoneVal(data[11].value);
    setAddressVal(data[12].value);
    setWebsiteVal(data[31].value);
    setAddressObject({
      street1: data[13].value,
      street2: data[14].value,
      city: data[15].value,
      state: data[16].value,
      zipCode: data[17].value,
    });
    setPaymentType(data[50].value);
    setPayeeName(data[51].value);

    const defaultValues = {
      artistOrg: data[6].value,
      email: data[7].value,
      numOfPerformers: data[19].value,
      phone: data[9].value,
      altPhone: data[11].value,
      website: data[31].value,
      street1: data[13].value,
      street2: data[14].value,
      city: data[15].value,
      state: data[16].value,
      zipCode: data[17].value,
    };
    informationForm.reset(defaultValues);
  };

  const cancelEdit = () => {
    setEditing(false);
    resetInformation();
  };

  const formatData = (d) => {
    const { data } = d;
    return data.map((record) => {
      return {
        id: record[3].value,
        firstName: record[6].value,
        lastName: record[7].value,
        email: record[8].value,
        phone: record[9].value,
        district: record[11].value,
        jobTitle: record[14].value,
      };
    });
  };

  if (isArtistLoading || isRegistrationLoading || isReferencesLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 pt-0">
      {/* Alerts */}
      <div className="mb-4 flex w-full flex-col items-center gap-2">
        {registrationData && !registrationData.data[0][6] && (
          <div className="flex w-full items-center justify-start gap-3 border border-yellow-500 bg-yellow-100 p-2 text-yellow-700">
            <CircleAlert size={20} />
            <p>
              This information is{" "}
              <span className="font-bold">Pending Approval</span>
            </p>
          </div>
        )}
        {!has3References && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not enough references!</AlertTitle>
            <AlertDescription>
              You are required to have at least 3 references to submit a new
              program.
            </AlertDescription>
          </Alert>
        )}
        {registrationData?.data[0][36].value != "" && (
          <Alert variant="info">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Changes Pending</AlertTitle>
            <AlertDescription>
              You have changes to your account information pending. You will see
              the changes once they are approved.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex flex-col gap-8">
        {/* General Information */}
        <div className="rounded-lg border border-border bg-foreground shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="text-lg font-medium text-primary">
                General Information
              </h2>
              <p className="text-tertiary mt-1 text-sm">
                General information about artist
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Pencil
                    className="cursor-pointer text-accent"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                    size={20}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-6 border-b border-border p-6">
            <Form {...informationForm}>
              <form
                onSubmit={informationForm.handleSubmit(updateArtistSubmit)}
                className={cn(editing ? "space-y-8" : "space-y-6")}
              >
                <FormField
                  control={informationForm.control}
                  name="artistOrg"
                  render={({ field }) =>
                    editing ? (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-secondary">
                          Artist / Org
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Artist / Org" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    ) : (
                      <ArtistItem
                        label="Artist / Org"
                        value={artistVal}
                        setValue={setArtistVal}
                      />
                    )
                  }
                />
                <div
                  className={cn(
                    "grid grid-cols-1",
                    editing ? "gap-8" : "gap-4",
                  )}
                >
                  <FormField
                    control={informationForm.control}
                    name="email"
                    render={({ field }) =>
                      editing ? (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-secondary">
                            <Mail className="text-tertiary h-4 w-4" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) : (
                        <ArtistItem
                          icon={<Mail className="text-tertiary h-4 w-4" />}
                          label="Email"
                          value={emailVal}
                          setValue={setEmailVal}
                        />
                      )
                    }
                  />
                  <FormField
                    control={informationForm.control}
                    name="phone"
                    render={({ field }) =>
                      editing ? (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-secondary">
                            <Phone className="text-tertiary h-4 w-4" />
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) : (
                        <ArtistItem
                          icon={<Phone className="text-tertiary h-4 w-4" />}
                          label="Phone"
                          value={phoneVal}
                          setValue={setPhoneVal}
                        />
                      )
                    }
                  />
                  {editing ? (
                    <div>
                      <div className="mb-4 flex items-center space-x-2">
                        <MapPin className="text-tertiary h-4 w-4" />
                        <label className="text-sm font-medium text-secondary">
                          Address
                        </label>
                      </div>
                      <div className="space-y-4 pl-6">
                        <FormField
                          control={informationForm.control}
                          name="street1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-secondary">
                                Street 1
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Main Street"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={informationForm.control}
                          name="street2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-secondary">
                                Street 2
                                <span className="text-tertiary text-xs">
                                  (Optional)
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Main Street"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={informationForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-secondary">
                                City
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={informationForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-secondary">
                                State
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={informationForm.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-secondary">
                                Zip Code
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                  placeholder="11801"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    <ArtistItem
                      icon={<MapPin className="text-tertiary h-4 w-4" />}
                      label="Address"
                      value={addressVal}
                      setValue={setAddressVal}
                    />
                  )}
                  <FormField
                    control={informationForm.control}
                    name="website"
                    render={({ field }) =>
                      editing ? (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-secondary">
                            <Globe className="text-tertiary h-4 w-4" />
                            Website
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="www.Google.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) : (
                        <ArtistItem
                          icon={<Globe className="text-tertiary h-4 w-4" />}
                          label="Website"
                          value={websiteVal}
                          setValue={setWebsiteVal}
                          link
                        />
                      )
                    }
                  />
                  <FormField
                    control={informationForm.control}
                    name="numOfPerformers"
                    render={({ field }) =>
                      editing ? (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-secondary">
                            <Users className="text-tertiary h-4 w-4" />
                            Number of Performers
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Number of Performers" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Less than Five">
                                  Less than Five
                                </SelectItem>
                                <SelectItem value="Five or More">
                                  Five or More
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) : (
                        <ArtistItem
                          icon={<Users className="text-tertiary h-4 w-4" />}
                          label="Number of Performers"
                          value={performersVal}
                          setValue={setPerformersVal}
                        />
                      )
                    }
                  />
                </div>
              </form>
            </Form>
          </div>
          <div className="rounded-b-lg  bg-foreground px-6 py-4">
            <div className="flex items-center justify-between">
              <Sheet
                open={changePasswordOpen}
                onOpenChange={setChangePasswordOpen}
              >
                <SheetTrigger
                  onClick={() => setChangePasswordOpen(true)}
                  className="w-fit cursor-pointer text-sm text-accent hover:underline"
                >
                  Change Password
                </SheetTrigger>
                <SheetContent className="min-w-[30%]">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex w-full flex-col gap-3"
                    >
                      <div>
                        <p className="text-2xl font-bold">Change Password</p>
                        <p className="text-tertiary">
                          {" "}
                          Ensure your account is using a long, random password
                          to stay secure.
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) =>
                          editing ? (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <PasswordInput
                                  placeholder="Current Password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) : (
                            <ArtistItem
                              icon={<Mail className="text-tertiary h-4 w-4" />}
                              label="Email"
                              value={emailVal}
                              setValue={setEmailVal}
                            />
                          )
                        }
                      />
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <PasswordInput
                                placeholder="New Password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <PasswordInput
                                placeholder="Confirm Password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" variant="accent">
                        Save
                      </Button>
                    </form>
                  </Form>
                </SheetContent>
              </Sheet>
              {editing && (
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    className="w-fit"
                    variant="outline"
                    onClick={() => cancelEdit()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={() =>
                      informationForm.handleSubmit(updateArtistSubmit)()
                    }
                    className="rounded-md bg-accent text-sm font-medium text-white transition-colors hover:bg-accent/80"
                    disabled={isUpdateArtistLoading}
                  >
                    {isUpdateArtistLoading && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isUpdateArtistLoading ? "Please wait" : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="rounded-lg border border-border bg-foreground shadow-sm">
          <div className="flex flex-col items-start justify-between border-b border-border p-6">
            <h2 className="text-lg font-medium text-primary">
              Payment Information
            </h2>
            <p className="text-tertiary mt-1 text-sm">
              Payment information about artist
            </p>
          </div>
          {/* Check, ETF (Direct Deposit) */}
          {artistData?.data && (
            <div className="flex space-x-10 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary">
                  Payment Type
                </label>
                <p>{artistData.data[0][50].value || "-"}</p>
              </div>
              {artistData.data[0][50].value === "Check" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary">
                    Payee Name
                  </label>
                  <p>{artistData.data[0][51].value || "-"}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* References */}
        {isReferencesLoading ? (
          <Spinner />
        ) : (
          <DataGrid
            tableTitle={"References"}
            data={formatData(referencesData || { data: [] })}
            columns={referencesColumns}
            readOnly={true}
            noSearch
            noFilter
            noSort
            addButtonText="Add Reference"
            CustomAddComponent={AddReference}
            sheetProps={{ title: "Add Reference", artistRecordId }}
          />
        )}
      </div>
    </div>
  );
};

export default ArtistInformationPage;
