import FileUpload from "@/components/FileUpload";

const FileUploadPage = () => {
  return (
    <>
      <header>
        <h1 className="text-3xl font-semibold capitalize">file upload page</h1>
        <p>
          Click the dropzone below to upload your files. You can also dragn and
          drop your files into the dropzone.
        </p>
      </header>
      <div className="w-3/4 max-h-40">
        <FileUpload scrollAreaHeight={80} />
      </div>
    </>
  );
};

export default FileUploadPage;
