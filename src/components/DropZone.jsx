import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  CloudUpload,
  Eye,
  FileImage,
  FileText,
  FolderArchive,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileTypes = Object.freeze({
  TEXT: "text",
  IMAGE: "image",
  PDF: "pdf",
});

const getFileType = (mimeType) => {
  if (mimeType.startsWith("image/")) return FileTypes.IMAGE;
  if (mimeType === "application/pdf") return FileTypes.PDF;
  if (mimeType.startsWith("text/")) return FileTypes.TEXT;
  return "other";
};

export const DropZone = ({ setUploadedFile }) => {
  const [preview, setPreview] = useState(null);
  const [uploadedFile, setUploadedFileInternal] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const generatePreview = (file) => {
    const fileType = getFileType(file.type);

    if (fileType === FileTypes.IMAGE) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      const pdfUrl = URL.createObjectURL(file);
      setPdfUrl(pdfUrl);
      setPreview("pdf");
    } else {
      setPreview(null);
    }
  };

  // Cleanup PDF URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const getFileIcon = (file) => {
    const fileType = getFileType(file.type);

    switch (fileType) {
      case FileTypes.IMAGE:
        return <FileImage size={24} className="text-purple-600" />;
      case FileTypes.TEXT:
        return <FileText size={24} className="text-blue-400" />;
      default:
        return <FolderArchive size={24} className="text-tertiary" />;
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setUploadedFileInternal(file);
      generatePreview(file);
    },
    [setUploadedFile],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadedFileInternal(null);
    setPreview(null);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return (
    <section className="w-full">
      <div
        {...getRootProps({
          className:
            "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background py-6 hover:bg-background/40",
        })}
      >
        <input {...getInputProps()} />
        <CloudUpload size={40} className="text-tertiary" />
        <p className="mt-2 text-sm font-semibold text-tertiary">Drag File</p>
        <p className="text-xs text-tertiary">
          Click to upload file &#40;files should be under 10 MB&#41;
        </p>
      </div>

      {uploadedFile && (
        <div className="mt-4">
          <Label className="text-sm font-medium text-tertiary">
            Selected File:
          </Label>
          <div className="mt-2 flex items-center gap-4 rounded-lg border border-border p-4">
            {/* Preview section */}
            <div className="flex h-12 w-12 items-center justify-center rounded border">
              {getFileType(uploadedFile.type) === FileTypes.IMAGE &&
              preview &&
              preview !== "pdf" ? (
                <FileImage size={24} className="text-purple-600" />
              ) : uploadedFile.type === "application/pdf" ? (
                <div className="flex h-12 w-12 items-center justify-center bg-red-100">
                  <span className="text-xs font-bold text-red-600">PDF</span>
                </div>
              ) : (
                getFileIcon(uploadedFile)
              )}
            </div>

            {/* File info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-tertiary">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-tertiary">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {/* Preview button - only show for images and PDFs */}
              {(getFileType(uploadedFile.type) === FileTypes.IMAGE ||
                uploadedFile.type === "application/pdf") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPreviewOpen(true);
                  }}
                >
                  <Eye size={16} />
                </Button>
              )}

              {/* Remove button */}
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview: {uploadedFile?.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription>Preview of the selected file</DialogDescription>
          <div className="mt-4">
            {uploadedFile &&
            getFileType(uploadedFile.type) === FileTypes.IMAGE &&
            preview &&
            preview !== "pdf" ? (
              <img
                src={preview}
                alt={uploadedFile.name}
                className="max-h-[70vh] w-full rounded object-contain"
              />
            ) : uploadedFile &&
              uploadedFile.type === "application/pdf" &&
              pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="h-[70vh] w-full rounded border"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
