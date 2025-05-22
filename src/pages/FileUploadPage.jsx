import DataGrid from "@/components/data-grid/data-grid";
import { DropZone } from "@/components/DropZone";
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
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
} from "@/redux/api/quickbaseApi";
import { documentColumns } from "@/utils/TableColumns";
import { downloadFile, getCutoffFiscalYearKey } from "@/utils/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { DownloadIcon, Loader2, UploadIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { selectArtistData } from "@/redux/slices/artistSlice";
import { handleSignout } from "@/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const INSTRUCTIONS = [
  "To upload a file, click the 'Upload a file' button below.",
  "Pick what file you are uploading from the dropdown menu",
  "Either select the file from your computer or drop the file into the page and click Submit.",
  "Once you are approved you will be able to log into your dashboard.",
];

const FileUploadPage = () => {
  const [documentTypes, setDocumentTypes] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [fileUploads, setFileUploads] = useState(null);
  const [open, setOpen] = useState(false);
  const { artist, cutoffDate } = useSelector(selectArtistData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: fileTypes, isLoading: isFileTypesLoading } =
    useQueryForDataQuery({
      from: import.meta.env.VITE_QUICKBASE_DOCUMENT_TYPES_TABLE_ID,
      select: [3, 7, 31],
    });
  const { data: documentsData, isLoading: isDocumentsDataLoading } =
    useQueryForDataQuery(
      artist
        ? {
            from: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
            select: [3, 6, 7, 9, 10, 11, 12, 14],
            where: `{9.EX.${artist}}`,
            sortBy: [{ fieldId: 11 }, { order: "DESC" }],
          }
        : { skip: !artist, refetchOnMountOrArgChange: true },
    );

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

  if (isDocumentTypesLoading || isDocumentTypesLoading || isArtistDataLoading) {
    return (
      <div className="pt-20">
        <Spinner />
      </div>
    );
  }

  const fiscalYearKey = useMemo(() => {
    const cutoffMonth = new Date(cutoffDate).getMonth();
    const cutoffDay = new Date(cutoffDate).getDate() + 1;
    return getCutoffFiscalYearKey(cutoffMonth, cutoffDay);
  }, [cutoffDate]);

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
    let base64 = await fileToBase64(fileUploads);
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

  if (isDocumentTypesError) {
    console.error(documentTypesError);
    return <p>There was an error querying the document types.</p>;
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

    const initialFileInputState = data.reduce((acc, documentType) => {
      acc[documentType[6].value] = [];
      return acc;
    }, {});
  }

  if (isDocumentsDataLoading || isFileTypesLoading) {
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      <header className="pb-10">
        <h1 className="text-3xl font-semibold capitalize">file upload page</h1>
        <p>You can attach your required documents here.</p>
      </header>
      <section className="pb-10">
        <h2 className="text-lg font-semibold">Instructions</h2>
        <ul className="list-disc pl-5">
          {INSTRUCTIONS.map((instruction) => (
            <li key={instruction} className="my-1">
              {instruction}
            </li>
          ))}
        </ul>
        <Button
          className="mt-4"
          variant="destructive"
          onClick={() => handleSignout(dispatch, navigate)}
        >
          Sign Out
        </Button>
      </section>
      <section>
        <div className="flex items-center gap-3 pb-4">
          <p className="text-sm text-gray-600">Upload a file:</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <UploadIcon className="size-4" />
              </Button>
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
                    {fileTypes.data.map(
                      (f) =>
                        (f[31].value == "Vendor Application" ||
                          f[31].value == "W-9") && (
                          <SelectItem value={f[31].value} key={f[31].value}>
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
                    type="submit"
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
          <div className="ml-6 flex flex-row gap-2">
            {!isFileTypesLoading &&
              fileTypes &&
              fileTypes.data.map(
                (f) =>
                  (f[31].value == "Vendor Application" ||
                    f[31].value == "W-9") && (
                    <Button
                      className="flex w-full items-center gap-2 md:w-auto"
                      key={f[31].value}
                      onClick={() => downloadTemplate(f)}
                    >
                      <DownloadIcon />
                      {f[31].value}
                    </Button>
                  ),
              )}
          </div>
        </div>
      </section>
      <section>
        {documentsData && (
          <DataGrid
            data={formatData(documentsData)}
            columns={documentColumns()}
            readOnly
          />
        )}
      </section>
    </div>
  );
};

export default FileUploadPage;
