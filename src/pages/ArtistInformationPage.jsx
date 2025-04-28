import DataGrid from "@/components/data-grid/data-grid";
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
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/ui/Spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
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
import { CircleAlert, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import "yup-phone-lite";

const ArtistItem = ({
  label,
  value,
  setValue,
  editing,
  dropdown = false,
  address = false,
}) => {
  let item = (
    <Input
      type="text"
      value={value}
      className="max-w-[400px]"
      onChange={(e) => setValue(e.target.value)}
    />
  );
  if (dropdown) {
    item = (
      <Select onValueChange={(val) => setValue(val)}>
        <SelectTrigger className="w-[400px]">
          <SelectValue placeholder="Number of Performers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Less than Five">Less than 5</SelectItem>
          <SelectItem value="More than Five">More than 5</SelectItem>
        </SelectContent>
      </Select>
    );
  } else if (address) {
    item = (
      <>
        <Label>Street line 1</Label>
        <Input
          className="max-w-[400px]"
          value={address.street1}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, street1: e.target.value }))
          }
        />
        <Label>Street line 2</Label>
        <Input
          className="max-w-[400px]"
          value={address.street2}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, street2: e.target.value }))
          }
        />
        <Label>City</Label>
        <Input
          className="max-w-[400px]"
          value={address.city}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, city: e.target.value }))
          }
        />
        <Label>State</Label>
        <Input
          className="max-w-[400px]"
          value={address.state}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, state: e.target.value }))
          }
        />
        <Label>Postal Code</Label>
        <Input
          className="max-w-[400px]"
          value={address.zipCode}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, zipCode: e.target.value }))
          }
        />
      </>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <Label className="font-semibold">{label}</Label>
      {editing ? <>{item}</> : <p>{value || "-"}</p>}
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

const ArtistInformationPage = () => {
  const [editing, setEditing] = useState(false);
  const [artistVal, setArtistVal] = useState("");
  const [performersVal, setPerformersVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [addressVal, setAddressVal] = useState("");
  const [websiteVal, setWebsiteVal] = useState("");
  const [addressObject, setAddressObject] = useState({});
  const [paymentType, setPaymentType] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const artistRecordId = useSelector((state) => state.auth.artistRecordId);

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

  const [
    updateArtist,
    {
      isLoading: isUpdateArtistLoading,
      isSuccess: isUpdateArtistSuccess,
      isError: isUpdateArtistError,
      error: updateArtistError,
    },
  ] = useAddOrUpdateRecordMutation();
  // SHOW ARTIST_INFO TABLE BUT UPDATE REGISTRATION
  let {
    data: artistsData,
    isLoading: isArtistsLoading,
    isError: isArtistsError,
    error: artistsError,
  } = useQueryForDataQuery(
    artistRecordId
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
          select: [
            3, 6, 7, 8, 9, 11, 12, 14, 15, 16, 17, 18, 19, 21, 23, 24, 25, 30,
            31,
          ],
          where: `{7.EX.${artistRecordId}} AND {25.EX.${getCurrentFiscalYear()}}`,
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
    if (artistsData) {
      resetInformation();
    }
  }, [artistsData]);

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
            value: artistsData.data[0][3].value,
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
    setArtistVal(artistsData.data[0][8].value);
    setPerformersVal(artistsData.data[0][21].value);
    setEmailVal(artistsData.data[0][9].value);
    setPhoneVal(artistsData.data[0][11].value);
    setAddressVal(artistsData.data[0][14].value);
    setWebsiteVal(artistsData.data[0][23].value);
    setAddressObject({
      street1: artistsData.data[0][15].value,
      street2: artistsData.data[0][16].value,
      city: artistsData.data[0][17].value,
      state: artistsData.data[0][18].value,
      zipCode: artistsData.data[0][19].value,
    });
    setPaymentType(artistsData.data[0][30].value);
    setPayeeName(artistsData.data[0][31].value);
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

  if (isArtistsLoading || isReferencesLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-3">
      {artistsData && !artistsData.data[0][6] && (
        <div className="flex w-full items-center justify-start gap-3 border border-yellow-500 bg-yellow-100 p-2 text-yellow-700">
          <CircleAlert size={20} />
          <p>
            This information is{" "}
            <span className="font-bold">Pending Approval</span>
          </p>
        </div>
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
      {isArtistsLoading ? (
        <div className="flex w-full flex-col items-start gap-4 rounded border border-gray-200 bg-white p-2.5">
          <Skeleton className="h-[20px] w-[300px] rounded-full" />
          <Skeleton className="h-[20px] w-[200px] rounded-full" />
          <Skeleton className="mt-2 h-[20px] w-[300px] rounded-full" />
          <Skeleton className="h-[20px] w-[200px] rounded-full" />
          <Skeleton className="mt-2 h-[20px] w-[300px] rounded-full" />
          <Skeleton className="h-[20px] w-[200px] rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                General information about artist
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ArtistItem
                label="Artist / Org"
                value={artistVal}
                setValue={setArtistVal}
                editing={editing}
              />
              <ArtistItem
                label="Number of Performers"
                value={performersVal}
                setValue={setPerformersVal}
                editing={editing}
                dropdown={true}
              />
              <ArtistItem
                label="Email"
                value={emailVal}
                setValue={setEmailVal}
                editing={editing}
              />
              <ArtistItem
                label="Phone"
                value={phoneVal}
                setValue={setPhoneVal}
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
                          Ensure your account is using a long, random password
                          to stay secure.
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
                Payment information about artist
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
      )}
    </div>
  );
};

export default ArtistInformationPage;
