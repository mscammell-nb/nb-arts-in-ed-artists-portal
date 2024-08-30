import { useState } from "react";
import { useGetFieldQuery } from "@/redux/api/quickbaseApi";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import Spinner from "@/components/ui/Spinner";
import FileUploadForm from "@/components/FileUploadForm";

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
    const data = documentTypesData.data;
    setDocumentTypes(
      data.map((record) => ({
        recordId: record[3].value,
        documentName: record[6].value,
        docoumentDescription: record[12].value,
      })),
    );

    const initialFileInputState = data.reduce((acc, documentType) => {
      acc[documentType[6].value] = [];
      return acc;
    }, {});

    setFileInputState(initialFileInputState);
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
      </section>
      <section>
        <FileUploadForm
          documentTypes={documentTypes}
          fileInputState={fileInputState}
          setFileInputState={setFileInputState}
        />
      </section>
    </div>
  );
};

export default FileUploadPage;
