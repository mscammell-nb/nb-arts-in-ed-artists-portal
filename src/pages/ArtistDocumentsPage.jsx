import { DropZone } from "@/components/DropZone";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import DataGrid from "@/components/ui/data-grid";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/Spinner";
import { toast } from "@/components/ui/use-toast";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import {
  TICKET_VENDOR,
  TICKET_VENDOR_EXCEPTION_FILES,
} from "@/utils/constants";
import { documentColumns } from "@/utils/TableColumns";
import {
  downloadFile,
  getCurrentFiscalYear,
  getCurrentFiscalYearKey,
} from "@/utils/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { DownloadIcon } from "@radix-ui/react-icons";
import { AlertCircleIcon, Loader2, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ArtistDocumentsPage = () => {
  const [fileUploads, setFileUploads] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [missingFiles, setMissingFiles] = useState([]);
  const artist = localStorage.getItem("artist/org");

  const { user } = useSelector((state) => state.auth);

  const { data: artistsData, isLoading: isArtistDataLoading } =
    useQueryForDataQuery(
      user
        ? {
            from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
            select: [46],
            where: `{10.EX.${user.uid}}`,
          }
        : { skip: !user, refetchOnMountOrArgChange: true },
    );

  const { data: fileTypes, isLoading: isFileTypesLoading } =
    useQueryForDataQuery({
      from: import.meta.env.VITE_QUICKBASE_DOCUMENT_TYPES_TABLE_ID,
      select: [3, 7, 31],
    });
  const { data: documentsData, isLoading: isDocumentsDataLoading } =
    useQueryForDataQuery({
      from: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
      select: [11, 9, 16, 7, 12, 6, 14, 3, 10],
      where: `{9.EX.${artist}}`,
      sortBy: [{ fieldId: 10 }, { order: "DESC" }],
    });

  const [
    addDocument,
    {
      isLoading: isAddDocumentLoading,
      isSuccess: isAddDocumentSuccess,
      isError: isAddDocumentError,
    },
  ] = useAddOrUpdateRecordMutation();

  useEffect(() => {
    if (documentsData && !isDocumentsDataLoading) {
      setMissingFiles([]);
      documentsData.data.forEach((doc) => {
        if (
          missingFiles.includes(doc[6].value) &&
          doc[11].value === getCurrentFiscalYear()
        ) {
          // Remove index of val
          setMissingFiles((curr) =>
            curr.filter((item) => item !== doc[6].value),
          );
        }
      });
    }
  }, [documentsData, isDocumentsDataLoading]);

  useEffect(() => {
    // Once file types and doc data are loaded, check to see which files are missing
    // Missing docs names, compare them to the docData.fileType
    if (documentsData && fileTypes) {
      let userTypes = documentsData.data
        .map((doc) => {
          if (doc[10].value == getCurrentFiscalYearKey()) return doc[6].value;
        })
        .filter((n) => n);

      const isTicketVendor = artistsData?.data[0][46].value === TICKET_VENDOR;

      for (let type of fileTypes.data) {
        const inUserTypes = userTypes.includes(type[31].value);
        const inTicketVendorException = TICKET_VENDOR_EXCEPTION_FILES.includes(
          type[31].value,
        );
        if ((!inUserTypes && !isTicketVendor) || (!inUserTypes && !inTicketVendorException)) {
          setMissingFiles((curr) => [...curr, type[31].value]);
        }
      }
    }
  }, [fileTypes, documentsData]);

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

  const formatData = (docData) => {
    const { data } = docData;
    return data.map((record) => {
      let versionNumber = [...record[7].value.versions];
      versionNumber = versionNumber.pop().versionNumber;
      return {
        id: record[3].value,
        fiscalYear: record[11].value,
        documentType: record[6].value,
        artist: record[9].value,
        documentName: record[7].value.versions[0].fileName,
        versionNumber: versionNumber,
        file: record[7],
      };
    });
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
    const fiscalYear = getCurrentFiscalYearKey();
    const artist = localStorage.getItem("artist/org");
    let base64 = await fileToBase64(fileUploads);
    base64 = base64.split("base64,")[1];
    addDocument({
      to: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
      data: [
        {
          10: { value: fiscalYear },
          9: { value: artist },
          7: {
            value: {
              fileName: fileUploads.name,
              data: base64,
            },
          },
          6: { value: selectedType },
        },
      ],
    });
  };
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

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

  if (isDocumentsDataLoading || isFileTypesLoading) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col gap-4 overflow-hidden">
      <p className="text-2xl font-semibold">Artist Documents</p>
      {missingFiles.length > 0 && (
        <Alert variant="destructive" className="bg-red-50">
          <AlertCircleIcon className="align-middle" />
          <AlertTitle>Missing file(s):</AlertTitle>
          <AlertDescription>
            Please submit the missing files for the current fiscal year,{" "}
            <span className="font-bold">{getCurrentFiscalYear()}</span>:
            <ul>
              {missingFiles.map((file) => (
                <li key={file}>- {file}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col items-center gap-3 md:flex-row">
        {!isFileTypesLoading &&
          fileTypes &&
          fileTypes.data.map((f) => (
            <Button
              className="flex w-full items-center gap-2 md:w-auto"
              key={f[31].value}
              onClick={() => downloadTemplate(f)}
            >
              <DownloadIcon />
              {f[31].value}
            </Button>
          ))}
      </div>
      {/* File Upload */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600">Upload a file: </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-full">
              <UploadIcon className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-1">Upload a file</DialogTitle>
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
                  {fileTypes.data.map((f) => (
                    <SelectItem value={f[31].value} key={f[31].value}>
                      {f[31].value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropZone setUploadedFile={setFileUploads} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={() => uploadFile()}
                  disabled={isAddDocumentLoading}
                >
                  {isAddDocumentLoading && <Loader2 className="animate-spin" />}
                  Submit
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {documentsData && (
        <DataGrid data={formatData(documentsData)} columns={documentColumns} readOnly />
      )}
    </div>
  );
};

export default ArtistDocumentsPage;
// TODO: Email all docs in welcome email when artist is created (from which email?)
// TODO: For the missing files, separate required files from optional files.
/*
  - Vendor Application (Required)
  - w-9 (Required)
  - OSPRA 102 (based on district)
  - OSPRA 104 (based on district)
  - Insurance Specification (artist information)
*/
