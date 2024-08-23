import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentFiscalYearKey } from "@/utils/getCurrentFiscalYearKey";
import { toBase64 } from "@/utils/toBase64";
import { useToast } from "@/components/ui/use-toast";
import { useAddOrUpdateRecordMutation } from "@/redux/api/quickbaseApi";
import FileUpload from "@/components/FileUpload";

const FileUploadForm = ({
  documentTypes,
  fileInputState,
  setFileInputState,
}) => {
  const { toast } = useToast();

  // TODO: change this to use global state from Redux once the protected routes method has been improved
  const artistRecordId = localStorage.getItem("artistRecordId");

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
      handleUploadFiles(fileInputState[documentType], documentType);
    });
  };

  const addFiles = (updatedFiles, documentType) => {
    setFileInputState((prev) => ({
      ...prev,
      [documentType]: [...prev[documentType], ...updatedFiles],
    }));
  };

  const resetFiles = (documentType) =>
    setFileInputState((prev) => ({ ...prev, [documentType]: [] }));

  const removeFiles = (updatedFiles, documentType) => {
    setFileInputState((prev) => ({
      ...prev,
      [documentType]: updatedFiles,
    }));
  };

  const handleUploadFiles = (files, documentType) => {
    if (files.length === 0) return;

    files.forEach(async (file) => {
      try {
        addArtistDocumentRecord({
          to: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
          data: [
            {
              10: {
                value: getCurrentFiscalYearKey(),
              },
              8: {
                value: artistRecordId,
              },
              6: {
                value: documentType,
              },
              7: {
                value: {
                  fileName: file.name,
                  data: await toBase64(file),
                },
              },
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
        <div className="grid grid-cols-2 gap-10">
          {documentTypes &&
            documentTypes.map((documentType) => (
              <div key={documentType}>
                <h3 className="mb-2 text-xl font-semibold capitalize">
                  {documentType}
                </h3>
                <FileUpload
                  files={fileInputState[documentType]}
                  addFiles={addFiles}
                  removeFiles={removeFiles}
                  documentType={documentType}
                  resetFiles={() => resetFiles(documentType)}
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
