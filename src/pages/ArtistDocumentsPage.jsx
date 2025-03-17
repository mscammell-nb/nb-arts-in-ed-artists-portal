import DataTable from "@/components/DataTable";
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
  SelectItem,
  SelectContent,
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
import { getCurrentFiscalYear, getCurrentFiscalYearKey } from "@/utils/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";
import { AlertCircleIcon, Loader2, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ArtistDocumentsPage = () => {
  const [fileUploads, setFileUploads] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [missingFiles, setMissingFiles] = useState([]);
  const artist = localStorage.getItem("artist/org");

  const {
    data: fileTypes,
    isSuccess: isFileTypesSuccess,
    isLoading: isFileTypesLoading,
    isError: isFileTypesError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_DOCUMENT_TYPES_TABLE_ID,
    select: [3, 7, 31],
  });
  const {
    data: documentsData,
    isSuccess: isDocumentsDataSuccess,
    isLoading: isDocumentsDataLoading,
    isError: isDocumentsDataError,
  } = useQueryForDataQuery({
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
      error: addDocumentError,
    },
  ] = useAddOrUpdateRecordMutation();

  const getFileName = (contentDisposition) => {
    if (!contentDisposition) return null;

    const filenameStarMatch = contentDisposition.match(
      /filename\*=utf-8''([^;]+)/i,
    );
    // RFC 5987 encoded (ex: filename*=utf-8''filename.txt)
    if (filenameStarMatch && filenameStarMatch[1])
      return decodeURIComponent(filenameStarMatch[1]);

    // Normal format
    const filenameMatch = contentDisposition.match(/filename\*="?(.+?)"?$/);
    if (filenameMatch && filenameMatch[1]) return filenameMatch[1];

    return null;
  };

  const downloadFile = async (tableId, fieldId, id, versionNumber) => {
    let headers = {
      "QB-Realm-Hostname": import.meta.env.VITE_QB_REALM_HOSTNAME,
      "User-Agent": "{User-Agent}",
      Authorization: `QB-USER-TOKEN ${import.meta.env.VITE_QUICKBASE_AUTHORIZATION_TOKEN}`,
      "Content-Type": "application/octet-stream",
    };
    fetch(
      `https://api.quickbase.com/v1/files/${tableId}/${id}/${fieldId}/${versionNumber}`,
      {
        method: "GET",
        headers: headers,
      },
    )
      .then(async (res) => {
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          const base64Data = await res.text();
          const linkSource = `data:${contentType};base64,${base64Data}`;
          const downloadLink = document.createElement("a");

          downloadLink.href = linkSource;
          downloadLink.download = getFileName(
            res.headers.get("content-disposition"),
          );
          downloadLink.click();
          return;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (documentsData && !isDocumentsDataLoading) {
      setMissingFiles([])
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
      for (let type of fileTypes.data) {
        if (!userTypes.includes(type[31].value)) {
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
    }
  }, [isAddDocumentError, isAddDocumentSuccess]);

  const getSortIcon = (column) => {
    switch (column.getIsSorted()) {
      case "asc":
        return <CaretUpIcon className="ml-2 h-4 w-4" />;
      case "desc":
        return <CaretDownIcon className="ml-2 h-4 w-4" />;
      default:
        return <CaretSortIcon className="ml-2 h-4 w-4" />;
    }
  };

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
    if (selectedType === '') {
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
    let versionNumber = [...file[7].value.versions]
    versionNumber = versionNumber.pop().versionNumber
    downloadFile(import.meta.env.VITE_QUICKBASE_DOCUMENT_TYPES_TABLE_ID,7, file[3].value, versionNumber)
  };

  if (isDocumentsDataLoading || isFileTypesLoading) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
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
      <div className="flex items-center gap-3">
        {(!isFileTypesLoading && fileTypes) &&
          fileTypes.data.map((f) => (
            <Button
              className="flex items-center gap-2"
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
        <DataTable
          data={formatData(documentsData)}
          columns={[
            {
              accessorKey: "fiscalYear",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Fiscal Year
                  {getSortIcon(column)}
                </Button>
              ),
            },
            {
              accessorKey: "artist",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Artist / Org
                  {getSortIcon(column)}
                </Button>
              ),
            },
            {
              accessorKey: "documentName",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Document Name
                  {getSortIcon(column)}
                </Button>
              ),
            },
            {
              accessorKey: "documentType",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Document Type
                  {getSortIcon(column)}
                </Button>
              ),
            },
            {
              header: "Download",
              id: "download",
              cell: ({ row }) => (
                <div className="grid w-full place-items-center">
                  <Button
                    onClick={() =>
                      downloadFile(
                        import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
                        7,
                        row.original.id,
                        row.original.versionNumber,
                      )
                    }
                    variant="outline"
                  >
                    <DownloadIcon />
                  </Button>
                </div>
              ),
            },
          ]}
        />
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
  - Program Contracts Payments Required (artist information)
*/