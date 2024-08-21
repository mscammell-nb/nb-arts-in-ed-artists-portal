import FileUpload from "@/components/FileUpload";

const FileUploadPage = () => {
  return (
    <div className="flex justify-center flex-col">
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
