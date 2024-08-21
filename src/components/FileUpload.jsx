import { useDropzone } from "react-dropzone";
import {
  FileImage,
  UploadCloud,
  X,
  FileText,
  FileVideo2,
  FolderArchive,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { getFileType } from "@/utils/getFileType";

const FileTypes = Object.freeze({
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
});

const imageColor = {
  bgColor: "bg-purple-600",
  fillColor: "fill-purple-600",
};

const videoColor = {
  bgColor: "bg-green-400",
  fillColor: "fill-green-400",
};

const otherColor = {
  bgColor: "bg-gray-400",
  fillColor: "fill-gray-400",
};

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const getFileIconAndColor = (file) => {
    if (getFileType(file.type) === FileTypes.TEXT) {
      return {
        icon: <FileText size={40} className={textColor.fillColor} />,
        color: textColor.bgColor,
      };
    }

    if (getFileType(file.type) === FileTypes.IMAGE) {
      return {
        icon: <FileImage size={40} className={imageColor.fillColor} />,
        color: imageColor.bgColor,
      };
    }

    if (getFileType(file.type) === FileTypes.VIDEO) {
      return {
        icon: <FileVideo2 size={40} className={videoColor.fillColor} />,
        color: videoColor.bgColor,
      };
    }

    return {
      icon: <FolderArchive size={40} className={otherColor.fillColor} />,
      color: otherColor.bgColor,
    };
  };

  const removeFile = (file) => {
    setFiles((prevFiles) => prevFiles.filter((item) => item !== file));
  };

  const onDrop = useCallback((acceptedFiles) => {
    // TODO: finish this function
    console.log(acceptedFiles);
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div>
        <div>
          <label
            {...getRootProps()}
            className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100"
          >
            <div className="text-center">
              <div className=" mx-auto max-w-min rounded-md border p-2">
                <UploadCloud size={20} />
              </div>

              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Drag files</span>
              </p>
              <p className="text-xs text-gray-500">
                {/* TODO: may need to change this */}
                Click to upload files &#40;files should be under 10 MB&#41;
              </p>
            </div>
          </label>

          <Input
            {...getInputProps()}
            id="file-dropzone"
            type="file"
            className="hidden"
          />
        </div>

        {files.length > 0 && (
          <div>
            {/* TODO: research how to do this with tailwind merge */}
            <ScrollArea className="h-80">
              <p className="my-2 mt-6 text-sm font-medium text-muted-foreground">
                Files to upload
              </p>
              <div className="space-y-2 pr-3">
                {files.map((file) => {
                  return (
                    <div
                      key={file.lastModified}
                      className="group flex justify-between gap-2 overflow-hidden rounded-lg border border-slate-100 pr-2 hover:pr-0"
                    >
                      <div className="flex flex-1 items-center p-2">
                        <div className="text-white">
                          {getFileIconAndColor(file).icon}
                        </div>

                        <div className="ml-2 w-full space-y-1">
                          <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground ">
                              {file.path}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file)}
                        className="hidden cursor-pointer items-center justify-center bg-red-500 px-2 text-white transition-all group-hover:flex"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUpload;
