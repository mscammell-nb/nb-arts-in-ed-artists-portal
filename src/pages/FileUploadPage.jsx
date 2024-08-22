import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { useGetFieldQuery } from "@/redux/api/quickbaseApi";
import Spinner from "@/components/ui/Spinner";

const FileUploadPage = () => {
  const [documentTypes, setDocumentTypes] = useState(null);
  const [fileInputState, setFileInputState] = useState(null);

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
    console.log("DATA: ", documentTypesData); // TODO: delete this log later

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

  return (
    <div className="flex flex-col justify-center">
      <header>
        <h1 className="text-3xl font-semibold capitalize">file upload page</h1>
        <p>TODO: write description</p>
      </header>
      <section>
        <form className="w-3/4">
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
        </form>
      </section>
    </div>
  );
};

export default FileUploadPage;
