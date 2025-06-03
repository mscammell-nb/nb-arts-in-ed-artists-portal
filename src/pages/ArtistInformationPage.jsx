import DataGrid from "@/components/data-grid/data-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
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
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { listFirebaseErrors } from "@/utils/listFirebaseErrors";
import { referencesColumns } from "@/utils/TableColumns";
import { getCurrentFiscalYear } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { AlertCircle, CircleAlert, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import "yup-phone-lite";

const ArtistItem = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1">
      <Label className="font-semibold">{label}</Label>
      <p>{value || "-"}</p>
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
  district: yup.object().required("District is required"),
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
      district: "",
    },
  });
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
            10: {
              value: data.district.identifier,
            },
            12: {
              value: sheetProps.artistRecordId,
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
        className="flex w-full flex-col gap-3"
      >
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
        <FormField
          control={referenceForm.control}
          name="referenceEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
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
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" isLoading={isLoading}>
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
    .number()
    .typeError("Zip code must be a number")
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

  const [
    updateArtist,
    {
      isLoading: isUpdateArtistLoading,
      isSuccess: isUpdateArtistSuccess,
      isError: isUpdateArtistError,
      error: updateArtistError,
    },
  ] = useAddOrUpdateRecordMutation();

  const ArtistInformationForm = ({ sheetProps }) => {
    const informationForm = useForm({
      resolver: yupResolver(informationSchema),
      defaultValues: {
        artistOrg: artistVal,
        email: emailVal,
        numOfPerformers: performersVal,
        phone: phoneVal,
        altPhone: altPhoneVal,
        street1: addressObject.street1,
        street2: addressObject.street2,
        city: addressObject.city,
        state: addressObject.state,
        zipcode: addressObject.zipCode,
        website: websiteVal,
      },
    });
    const addReferenceSubmit = async (data) => {
      try {
        updateArtist({
          to: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
          data: [
            {
              3: {
                value: registrationData.data[0][3].value,
              },
              8: {
                value: artistVal,
              },
              21: {
                value: performersVal,
              },
              9: {
                value: emailVal,
              },
              11: {
                value: phoneVal,
              },
              15: { value: addressObject.street1 },
              16: { value: addressObject.street2 },
              17: { value: addressObject.city },
              18: { value: addressObject.state },
              19: { value: addressObject.zipCode },
              20: {
                value: "United States",
              },
              23: {
                value: websiteVal,
              },
              36: {
                value: (() => {
                  const keys = Object.keys(artistData);
                  const changedKeys = keys.filter(
                    (key) =>
                      artistData[key] !==
                      registrationData.data[0][Number(key)].value,
                  );
                  if (changedKeys.length === 0) return "";
                  return changedKeys
                    .map(
                      (key) =>
                        `${registrationData.data[0][Number(key)].label} ${
                          registrationData.data[0][Number(key)].value
                        } --> ${artistData[key]}`,
                    )
                    .join("\n");
                })(),
              },
            },
          ],
        });
        setEditing(false);
      } catch (error) {
        console.error(error);
      }
    };
    return (
      <Form {...informationForm}>
        <form className="flex w-full flex-col gap-3">
          <FormField
            control={informationForm.control}
            name="artistOrg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist / Org</FormLabel>
                <FormControl>
                  <Input placeholder="Artist / Org" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={informationForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={informationForm.control}
            name="numOfPerformers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Performers</FormLabel>
                <FormControl>
                  <Select onValueChange={(val) => setValue(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Number of Performers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Less than Five">
                        Less than 5
                      </SelectItem>
                      <SelectItem value="Five or More">5 or More</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={informationForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={informationForm.control}
            name="altPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alt Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Alt Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
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
          where: `{7.EX.${artistRecordId}} AND {25.EX.${getCurrentFiscalYear()}}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
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
          where: `{3.EX.${artistRecordId}}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );

  const { data: referencesData, isLoading: isReferencesLoading } =
    useQueryForDataQuery(
      artistRecordId
        ? {
            from: import.meta.env.VITE_QUICKBASE_REFERENCES_TABLE_ID,
            select: [3, 6, 7, 8, 9, 10, 11, 12],
            where: `{12.EX.${artistRecordId}}`,
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

  const onSave = () => {
    updateArtist({
      to: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
      data: [
        {
          3: {
            value: registrationData.data[0][3].value,
          },
          8: {
            value: artistVal,
          },
          21: {
            value: performersVal,
          },
          9: {
            value: emailVal,
          },
          11: {
            value: phoneVal,
          },
          15: { value: addressObject.street1 },
          16: { value: addressObject.street2 },
          17: { value: addressObject.city },
          18: { value: addressObject.state },
          19: { value: addressObject.zipCode },
          20: {
            value: "United States",
          },
          23: {
            value: websiteVal,
          },
        },
      ],
    });
    setEditing(false);
  };
  const cancelEdit = () => {
    setEditing(false);
    resetInformation();
  };

  const resetInformation = () => {
    setArtistVal(artistData.data[0][6].value);
    setPerformersVal(artistData.data[0][19].value);
    setEmailVal(artistData.data[0][7].value);
    setPhoneVal(artistData.data[0][9].value);
    setAltPhoneVal(artistData.data[0][11].value);
    setAddressVal(artistData.data[0][12].value);
    setWebsiteVal(artistData.data[0][31].value);
    setAddressObject({
      street1: artistData.data[0][13].value,
      street2: artistData.data[0][14].value,
      city: artistData.data[0][15].value,
      state: artistData.data[0][16].value,
      zipCode: artistData.data[0][17].value,
    });
    setPaymentType(artistData.data[0][50].value);
    setPayeeName(artistData.data[0][51].value);
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
    <div className="flex w-full max-w-[1200px] flex-col gap-3">
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

      <div className="flex w-full items-center justify-between rounded border border-gray-200 bg-white p-2.5">
        <p className="text-xl font-semibold">Artist Information</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Pencil
                className="cursor-pointer text-blue-400"
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

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Your account's general information
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {editing && <ArtistInformationForm />}
            {!editing && (
              <>
                {" "}
                <ArtistItem
                  label="Artist / Org"
                  value={artistVal}
                  setValue={setArtistVal}
                  editing={false}
                />
                <ArtistItem
                  label="Email"
                  value={emailVal}
                  setValue={setEmailVal}
                  editing={false}
                />
                <ArtistItem
                  label="Number of Performers"
                  value={performersVal}
                  setValue={setPerformersVal}
                  editing={editing}
                  dropdown={true}
                />
                <ArtistItem
                  label="Phone"
                  value={phoneVal}
                  setValue={setPhoneVal}
                  editing={editing}
                />
                <ArtistItem
                  label="Alt Phone"
                  value={altPhoneVal}
                  setValue={setAltPhoneVal}
                  editing={editing}
                />
                <ArtistItem
                  label="Address"
                  value={addressVal}
                  setValue={setAddressObject}
                  editing={editing}
                  address={addressObject}
                />
                <ArtistItem
                  label="Website"
                  value={websiteVal}
                  setValue={setWebsiteVal}
                  editing={editing}
                />
              </>
            )}

            <Sheet
              open={changePasswordOpen}
              onOpenChange={setChangePasswordOpen}
            >
              <SheetTrigger
                onClick={() => setChangePasswordOpen(true)}
                className="mt-3 w-fit cursor-pointer text-sm text-blue-500 hover:underline"
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
                      <p className="text-gray-500">
                        {" "}
                        Ensure your account is using a long, random password to
                        stay secure.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
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
                      )}
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
                    <Button type="submit" className="w-fit">
                      Save
                    </Button>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>
            {editing && (
              <div className="flex gap-3">
                <Button
                  className="w-fit"
                  variant="secondary"
                  onClick={() => cancelEdit()}
                >
                  Cancel
                </Button>
                <Button className="w-fit" onClick={() => onSave()}>
                  Save
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              Your account's payment information
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ArtistItem
              label="Payment Type"
              value={paymentType}
              setValue={setPaymentType}
              editing={false}
            />
            {paymentType === "Check" && (
              <ArtistItem
                label="Payee Name"
                value={payeeName}
                setValue={setPayeeName}
                editing={false}
              />
            )}
          </CardContent>
        </Card>
        {isReferencesLoading ? (
          <Spinner />
        ) : (
          <div className="col-span-2">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistInformationPage;
