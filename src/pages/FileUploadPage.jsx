import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { useGetFieldQuery } from "@/redux/api/quickbaseApi";
import { useAddOrUpdateRecordMutation } from "@/redux/api/quickbaseApi";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { getCurrentFiscalYearKey } from "@/utils/getCurrentFiscalYearKey";
import { toBase64 } from "@/utils/toBase64";

const INSTRUCTIONS = [
  "To upload a file, click or drop the file into the dropzone.",
  "You can attach multiple files to each dropzone if needed.",
  "Hover over an attached file to reveal the remove file button. Click this button to remove a file.",
  'Click the "Clear Files" button to remove all files attached to a dropzone.',
  'When you are done, click the "Submit Files" button at the bottom of the page.',
];

const FileUploadPage = () => {
  const [documentTypes, setDocumentTypes] = useState(null);
  const [fileInputState, setFileInputState] = useState(null);

  // TODO: change this to use global state from Redux once the protected routes method has been improved
  const artistRecordId = localStorage.getItem("artistRecordId");

  const {
    data: documentTypesData,
    isLoading: isDocumentTypesLoading,
    isSuccess: isDocumentTypesSuccess,
    isError: isDocumentTypesError,
    error: documentTypesError,
  } = useGetFieldQuery({
    fieldId: 6,
    tableId: import.meta.env.VITE_QUICKBASE_ARTISTS_FILES_TABLE_ID,
  });
  const [
    addArtistDocumentRecord,
    {
      isLoading: isAddArtistDocumentRecordLoading,
      isSuccess: isAddArtistDocumentRecordSuccess,
      isError: isAddArtistDocumentRecordError,
      error: addArtistDocumentRecordError,
    },
  ] = useAddOrUpdateRecordMutation();

  if (isDocumentTypesLoading) {
    return (
      <div className="pt-20">
        <Spinner />
      </div>
    );
  }

  if (isDocumentTypesError) {
    console.error(documentTypesError);
    return <p>There was an error querying the document types.</p>;
  }

  if (isDocumentTypesSuccess && documentTypes === null) {
    const documentTypes = documentTypesData.properties.choices;
    setDocumentTypes(documentTypes);

    const initialFileInputState = documentTypes.reduce((acc, documentType) => {
      acc[documentType] = [];
      return acc;
    }, {});

    setFileInputState(initialFileInputState);
  }

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

  const handleSubmit = (e) => {
    e.preventDefault();

    documentTypes.forEach((documentType) => {
      handleUploadFiles(fileInputState[documentType], documentType);
    });
  };

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
      </section>
      {/* TODO: add success and failure toasts */}
      {/* TODO: consider moving the form to its own component. This component would include the toasts */}
      <section>
        <form id="documentUploadForm" onSubmit={handleSubmit} className="">
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
      </section>
    </div>
  );
};

export default FileUploadPage;
