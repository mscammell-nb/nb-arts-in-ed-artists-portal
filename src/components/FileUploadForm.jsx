import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAddOrUpdateRecordMutation } from "@/redux/api/quickbaseApi";
import { toBase64 } from "@/utils/toBase64";
import { getCutoffFiscalYearKey } from "@/utils/utils";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "./ui/Spinner";

const FileUploadForm = ({
  documentTypes,
  fileInputState,
  setFileInputState,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const cutoffDate = useSelector((state) => state.auth.cutoffDate);

  const fiscalYearKey = useMemo(() => {
    const cutoffMonth = new Date(cutoffDate).getMonth();
    const cutoffDay = new Date(cutoffDate).getDate() + 1;
    return getCutoffFiscalYearKey(cutoffMonth, cutoffDay);
  }, [cutoffDate]);
  const [
    addArtistDocumentRecord,
    {
      isLoading: isAddArtistDocumentRecordLoading,
      isSuccess: isAddArtistDocumentRecordSuccess,
      isError: isAddArtistDocumentRecordError,
      error: addArtistDocumentRecordError,
    },
  ] = useAddOrUpdateRecordMutation();

  useEffect(() => {
    if (isAddArtistDocumentRecordSuccess) {
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "Your documents have been submitted.",
      });
      navigate("/registration-gate");
    }

    if (isAddArtistDocumentRecordError) {
      console.error(addArtistDocumentRecordError);
      toast({
        variant: "destructive",
        title: "Error submitting documents",
        description: addArtistDocumentRecordError.data.message,
      });
    }
  }, [
    isAddArtistDocumentRecordSuccess,
    isAddArtistDocumentRecordError,
    addArtistDocumentRecordError,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    documentTypes.forEach((documentType) => {
      handleUploadFiles(
        fileInputState[documentType.documentName],
        documentType,
      );
    });
  };

  const addFiles = (updatedFiles, documentType) => {
    setFileInputState((prev) => ({
      ...prev,
      [documentType.documentName]: [
        ...prev[documentType.documentName],
        ...updatedFiles,
      ],
    }));
  };

  const resetFiles = (documentType) =>
    setFileInputState((prev) => ({ ...prev, [documentType]: [] }));

  const removeFiles = (updatedFiles, documentType) => {
    setFileInputState((prev) => ({
      ...prev,
      [documentType.documentName]: updatedFiles,
    }));
  };

  if (isArtistDataLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const handleUploadFiles = (files, documentType) => {
    if (files.length === 0) return;

    files.forEach(async (file) => {
      try {
        addArtistDocumentRecord({
          to: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
          data: [
            {
              10: {
                value: fiscalYearKey,
              },
              8: {
                value: artistRecordId,
              },
              7: {
                value: {
                  fileName: file.name,
                  data: await toBase64(file),
                },
              },
              15: {
                value: documentType.recordId,
              },
              17: { value: false },
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <>
      <form id="documentUploadForm" onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-10">
          {documentTypes &&
            documentTypes.map((documentType) => (
              <div key={documentType.recordId}>
                <h3 className="mb-2 text-xl font-semibold capitalize">
                  {documentType.documentName}
                </h3>
                <FileUpload
                  files={fileInputState[documentType.documentName]}
                  addFiles={addFiles}
                  removeFiles={removeFiles}
                  documentType={documentType}
                  resetFiles={() => resetFiles(documentType.documentName)}
                />
              </div>
            ))}
        </div>
      </form>
      <div className="flex justify-center">
        <Button
          variant="bocesSecondary"
          form="documentUploadForm"
          type="submit"
          size="lg"
          isLoading={isAddArtistDocumentRecordLoading}
          className="mt-10 w-60 uppercase"
        >
          Submit files
        </Button>
      </div>
    </>
  );
};

export default FileUploadForm;
