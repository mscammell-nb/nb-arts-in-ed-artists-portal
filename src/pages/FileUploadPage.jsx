import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { useGetFieldQuery } from "@/redux/api/quickbaseApi";
import Spinner from "@/components/ui/Spinner";

const FileUploadPage = () => {
  const [documentTypes, setdocumentTypes] = useState(null);

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
    setdocumentTypes(documentTypesData.properties.choices);
  }

  return (
    <div className="flex flex-col justify-center">
      <header>
        <h1 className="text-3xl font-semibold capitalize">file upload page</h1>
        <p>
          Click the dropzone below to upload your files. You can also drag and
          drop your files into the dropzone.
        </p>
      </header>
      <div>
        <div className="w-3/4">
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;
