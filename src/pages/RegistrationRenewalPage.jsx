import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import { STATES, VALID_WEBSITE_URL_REGEX } from "@/constants/constants";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import {
  downloadFile,
  getCutoffFiscalYear,
  getCutoffFiscalYearKey,
  getNextFiscalYearKey,
  parsePhoneNumber,
} from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Spinner from "../components/ui/Spinner";

import { DropZone } from "@/components/DropZone";
import { documentColumns } from "@/utils/TableColumns";

import DataGrid from "@/components/data-grid/data-grid";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDocData } from "@/utils/formatDocData";
import { toBase64 } from "@/utils/toBase64";
import { Label } from "@radix-ui/react-dropdown-menu";
import { DownloadIcon, Loader2, UploadIcon } from "lucide-react";

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
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fileUploads, setFileUploads] = useState(null);
  const [documentTypes, setDocumentTypes] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [open, setOpen] = useState(false);
  const artist = useSelector((state) => state.auth.artistOrg);
  const [fiscalYearKey, setFiscalYearKey] = useState(getNextFiscalYearKey());

  const {
    data: artistData,
    isLoading: isArtistLoading,
    isError: isArtistDataError,
    error: artistDataError,
  } = useQueryForDataQuery(
    user
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
          select: [3, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17, 31, 48],
          where: `{10.EX.${user.uid}}`,
        }
      : { skip: !user, refetchOnMountOrArgChange: true },
  );

  const [
    addOrUpdateRecord,
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
      fiscalYear: "",
    },
  });

  const { reset, setValue } = form;

  useEffect(() => {
    if (artistData) {
      const data = artistData.data[0];
      const cutoffMonth = new Date(data[48].value).getMonth();
      const cutoffDay = new Date(data[48].value).getDate() + 1;
      const tempFiscalYear = getCutoffFiscalYear(cutoffMonth, cutoffDay);
      const tempFiscalYearKey = getCutoffFiscalYearKey(cutoffMonth, cutoffDay);
      setFiscalYearKey(tempFiscalYearKey);
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
        fiscalYear: tempFiscalYear,
        fiscalYearKey: tempFiscalYearKey,
      };
      reset(defaultValues);
      setValue("state", data[16].value);
    }
  }, [artistData, reset, setValue]);

  const formatDataForQuickbase = (data) => {
    const cutoffMonth = new Date(artistData.data[0][48].value).getMonth();
    const cutoffDay = new Date(artistData.data[0][48].value).getDate() + 1;
    const tempFiscalYearKey = getCutoffFiscalYearKey(cutoffMonth, cutoffDay);
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
            value: user.uid,
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
            value: tempFiscalYearKey,
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
      navigate("/programs");
    }

    if (isNewArtistRegistrationError && newArtistRegistrationError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: newArtistRegistrationError.data.code,
      });
      navigate("/");
    }
  }, [
    isNewArtistRegistrationSuccess,
    isNewArtistRegistrationError,
    newArtistRegistrationError,
    toast,
  ]);

  const onSubmit = (data) => {
    addOrUpdateRecord(formatDataForQuickbase(data));
  };

  const uploadFile = async () => {
    if (fileUploads === null) {
      toast({
        variant: "destructive",
        title: "Error submitting documents",
        description: "Please upload a file.",
      });
      return;
    }
    if (selectedType === "") {
      toast({
        variant: "destructive",
        title: "Error submitting documents",
        description: "Please select a file type",
      });
      return;
    }
    const artist = useSelector((state) => state.auth.artistOrg);
    let base64 = await toBase64(fileUploads);
    base64 = base64.split("base64,")[1];
    addDocument({
      to: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
      data: [
        {
          10: { value: fiscalYearKey },
          9: { value: artist },
          7: {
            value: {
              fileName: fileUploads.name,
              data: base64,
            },
          },
          6: { value: selectedType }
        },
      ],
    });
  };

  const [
    addDocument,
    {
      isLoading: isAddDocumentLoading,
      isSuccess: isAddDocumentSuccess,
      isError: isAddDocumentError,
    },
  ] = useAddOrUpdateRecordMutation();

  useEffect(() => {
    if (isAddDocumentError) {
      toast({
        variant: "destructive",
        title: "Error submitting documents",
        description: addArtistDocumentRecordError.data.message,
      });
      setOpen(false);
    } else if (isAddDocumentSuccess) {
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "Your documents have been submitted.",
      });
      setOpen(false);
      setSelectedType("");
    }
  }, [isAddDocumentError, isAddDocumentSuccess]);

  const downloadTemplate = (file) => {
    let versionNumber = [...file[7].value.versions];
    versionNumber = versionNumber.pop().versionNumber;
    downloadFile(
      import.meta.env.VITE_QUICKBASE_DOCUMENT_TYPES_TABLE_ID,
      7,
      file[3].value,
      versionNumber,
    );
  };

  const {
    data: documentTypesData,
    isLoading: isDocumentTypesLoading,
    isSuccess: isDocumentTypesSuccess,
    isError: isDocumentTypesError,
    error: documentTypesError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_DOCUMENT_TYPES_TABLE_ID,
    select: [3, 6, 12],
    where: "{'13'.EX.'true'}",
  });

  const { data: fileTypes, isLoading: isFileTypesLoading } =
    useQueryForDataQuery({
      from: import.meta.env.VITE_QUICKBASE_DOCUMENT_TYPES_TABLE_ID,
      select: [3, 7, 31],
    });
  // TODO UPDATE DOCUMENTS CURRENT COL
  const { data: documentsData, isLoading: isDocumentsDataLoading } =
    useQueryForDataQuery(
      artist
        ? {
            from: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
            select: [3, 6, 7, 9, 10, 11, 12, 14],
            where: `{9.EX.${artist}} AND {10.EX.${fiscalYearKey}}`,
            sortBy: [{ fieldId: 10 }, { order: "DESC" }],
          }
        : { skip: !artist, refetchOnMountOrArgChange: true },
    );

  if (
    isArtistLoading ||
    isDocumentTypesLoading ||
    isDocumentsDataLoading ||
    isFileTypesLoading
  ) {
    return (
      <div className="pt-20">
        <Spinner />
      </div>
    );
  }

  if (isDocumentTypesSuccess && documentTypes === null) {
    const data = documentTypesData.data;
    setDocumentTypes(
      data.map((record) => ({
        recordId: record[3].value,
        documentName: record[6].value,
        documentDescription: record[12].value,
      })),
    );
  }

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
    <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 py-16">
      <div className="mx-auto flex w-full max-w-xl flex-grow">
        <Button
          variant="secondary"
          onClick={() => navigate("/registration-gate")}
          className="flex items-center justify-start space-x-2 justify-self-start rounded-md bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </Button>
      </div>

      <Card className="w-full max-w-xl">
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

              <FormField
                control={form.control}
                name="fiscalYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiscal Year</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Fiscal Year" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="items-left flex flex-col gap-3 pb-4">
                <p className="text-sm font-semibold">Upload Files</p>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 rounded-full">
                      <UploadIcon className="size-4" />
                      <p>Upload File</p>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="mb-1">Upload a file</DialogTitle>
                      <p>
                        Please reupload your Vendor Application and W-9 files
                        along with any changes you have for the new fiscal year.
                      </p>
                    </DialogHeader>
                    <Separator />
                    <div className="flex flex-col gap-2">
                      <Label>File Type</Label>
                      <Select
                        value={selectedType}
                        onValueChange={(e) => setSelectedType(e)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a file type" />
                        </SelectTrigger>
                        <SelectContent>
                          {fileTypes.data.map(
                            (f) =>
                              (f[31].value == "Vendor Application" ||
                                f[31].value == "W-9") && (
                                <SelectItem
                                  value={f[31].value}
                                  key={f[31].value}
                                >
                                  {f[31].value}
                                </SelectItem>
                              ),
                          )}
                        </SelectContent>
                      </Select>
                      <DropZone setUploadedFile={setFileUploads} />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                        <Button
                          onClick={() => uploadFile()}
                          disabled={isAddDocumentLoading}
                        >
                          {isAddDocumentLoading && (
                            <Loader2 className="animate-spin" />
                          )}
                          Submit
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="flex flex-row gap-4">
                  {!isFileTypesLoading &&
                    fileTypes &&
                    fileTypes.data.map(
                      (f) =>
                        (f[31].value == "Vendor Application" ||
                          f[31].value == "W-9") && (
                          <Button
                            className="flex w-full items-center gap-2 md:w-auto"
                            key={f[31].value}
                            type="button"
                            onClick={() => downloadTemplate(f)}
                          >
                            <DownloadIcon />
                            {f[31].value}
                          </Button>
                        ),
                    )}
                </div>
              </div>
              <p className="text-sm font-semibold">Submitted Files</p>
              {documentsData && (
                <DataGrid
                  data={formatDocData(documentsData)}
                  columns={documentColumns(false, false)}
                  readOnly
                  noSearch
                  noFilter
                  noSort
                />
              )}

              <Button
                type="submit"
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
