import { Label } from "@radix-ui/react-dropdown-menu";
import { UploadCloudIcon } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

export const DropZone = ({setUploadedFile}) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setUploadedFile(acceptedFiles[0]),
    maxFiles: 1,
  });

  return (
    <section className="w-full">
      <div
        {...getRootProps({
          className:
            "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100",
        })}
      >
        <input {...getInputProps()} />
        <UploadCloudIcon />
        <p className="mt-2 text-sm font-semibold text-gray-600">Drag File</p>
        <p className="text-xs text-gray-500">
          Click to upload file &#40;files should be under 10 MB&#41;
        </p>
      </div>
      <aside>
        {acceptedFiles.length > 0 && (
          <div>
            <Label>Selected File:</Label>
            <p>{acceptedFiles[0].name}</p>
          </div>
        )}
      </aside>
    </section>
  );
};
