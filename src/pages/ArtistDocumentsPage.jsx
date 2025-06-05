import DataGrid from "@/components/data-grid/data-grid";
import { DropZone } from "@/components/DropZone";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  TICKET_VENDOR,
  TICKET_VENDOR_EXCEPTION_FILES,
} from "@/constants/constants";
import {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { documentColumns } from "@/utils/TableColumns";
import {
  downloadFile,
  getCurrentFiscalYear,
  getCurrentFiscalYearKey,
} from "@/utils/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { AlertCircleIcon, Download, Loader2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ArtistDocumentsPage = () => {
  const [existingTypes, setExistingTypes] = useState([]);
  const [fileUploads, setFileUploads] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [missingFiles, setMissingFiles] = useState([]);
  const artistOrg = useSelector((state) => state.artist.artistOrg);
  const user = useSelector((state) => state.auth.user);

  const { data: artistsData, isLoading: isArtistDataLoading } =
    useQueryForDataQuery(
      user
        ? {
            from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
            select: [46],
            where: `{10.EX.'${user.uid}'}`,
          }
        : { skip: !user, refetchOnMountOrArgChange: true },
    );

  const { data: fileTypes, isLoading: isFileTypesLoading } =
    useQueryForDataQuery({
      from: import.meta.env.VITE_QUICKBASE_DOCUMENT_TYPES_TABLE_ID,
      select: [3, 7, 31],
    });
  const { data: documentsData, isLoading: isDocumentsDataLoading } =
    useQueryForDataQuery(
      artistOrg
        ? {
            from: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
            select: [3, 6, 7, 9, 10, 11, 12, 14],
            where: `{9.EX.'${artistOrg}'} AND {11.EX.'${getCurrentFiscalYear()}'}`,
            sortBy: [{ fieldId: 11 }, { order: "DESC" }],
          }
        : { skip: !artistOrg, refetchOnMountOrArgChange: true },
    );

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
      let userTypes = documentsData.data.map((doc) => doc[6].value);

      const isTicketVendor = artistsData?.data[0][46].value === TICKET_VENDOR;

      for (let type of fileTypes.data) {
        const inUserTypes = userTypes.includes(type[31].value);
        const inTicketVendorException = TICKET_VENDOR_EXCEPTION_FILES.includes(
          type[31].value,
        );
        if (
          (!inUserTypes && !isTicketVendor) ||
          (!inUserTypes && !inTicketVendorException)
        ) {
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
      let version = [...record[7].value.versions].pop();
      let fileName = version.fileName;
      let versionNumber = version.versionNumber;
      return {
        id: record[3].value,
        fiscalYear: record[11].value,
        documentType: record[6].value,
        artist: record[9].value,
        documentName: fileName,
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
    const fiscalYearKey = getCurrentFiscalYearKey();
    let base64 = await fileToBase64(fileUploads);
    base64 = base64.split("base64,")[1];

    if (!missingFiles.includes(selectedType)) {
      const existingRecord = documentsData.data.find(
        (doc) => doc[6]?.value === selectedType,
      );
      addDocument({
        to: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
        data: [
          {
            3: { value: existingRecord[3]?.value },
            7: {
              value: {
                fileName: fileUploads.name,
                data: base64,
              },
            },
          },
        ],
      });
    } else {
      addDocument({
        to: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
        data: [
          {
            10: { value: fiscalYearKey },
            9: { value: artistOrg },
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
    }
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
      {missingFiles.length > 0 && (
        <Alert variant="destructive" className="bg-red-50 text-red-700">
          <AlertCircleIcon className="stroke-red-700 align-middle" />
          <AlertTitle className="font-semibold">Missing file(s):</AlertTitle>
          <AlertDescription>
            Please submit the missing files for the current fiscal year,{" "}
            <span className="font-bold">{getCurrentFiscalYear()}</span>:
            <ul className="list-disc">
              {missingFiles.map((file) => (
                <li key={file}>{file}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Download Document Templates
        </h3>
        <div className="flex flex-wrap gap-3">
          {!isFileTypesLoading &&
            fileTypes &&
            fileTypes.data.map((f) => (
              <Button
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                key={f[31].value}
                onClick={() => downloadTemplate(f)}
              >
                <Download className="h-4 w-4" />
                <span>{f[31].value}</span>
              </Button>
            ))}
        </div>
      </div>
      {/* File Upload */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Upload a file:
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="group flex w-full max-w-md items-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Upload a file</p>
                <p className="text-sm text-gray-500">Click to browse files</p>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm sm:max-w-lg">
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
        <DataGrid
          data={formatData(documentsData)}
          columns={documentColumns()}
          readOnly
        />
      )}
    </div>
  );
};

export default ArtistDocumentsPage;
