import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { useGetFieldQuery } from "@/redux/api/quickbaseApi";
import { useAddOrUpdateRecordMutation } from "@/redux/api/quickbaseApi";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { getCurrentFiscalYearKey } from "@/utils/getCurrentFiscalYearKey";
import { toBase64 } from "@/utils/toBase64";

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
    { data, isLoading, isSuccess, isError, error },
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
      <header>
        <h1 className="text-3xl font-semibold capitalize">file upload page</h1>
        <p>TODO: write description</p>
      </header>
      <section>
        <form onSubmit={handleSubmit} className="w-3/4">
          {documentTypes &&
            documentTypes.map((documentType) => (
              <div key={documentType}>
                <h2 className="text-lg font-semibold capitalize">
                  {documentType}
                </h2>
                <FileUpload
                  files={fileInputState[documentType]}
                  addFiles={addFiles}
                  removeFiles={removeFiles}
                  documentType={documentType}
                />
              </div>
            ))}
          <Button type="submit">Submit</Button>
        </form>
      </section>
    </div>
  );
};

export default FileUploadPage;
