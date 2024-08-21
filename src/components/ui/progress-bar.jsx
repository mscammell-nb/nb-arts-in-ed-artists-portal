import { cn } from "@/lib/utils";

const ProgressBar = ({ progress, className }) => {
  return (
    <div className="relative h-1">
      <div className="absolute bottom-0 left-0 top-0 h-full w-full rounded-full bg-gray-200"></div>
      <div
        style={{
          width: `${progress}%`,
        }}
        className={cn(
          "absolute bottom-0 left-0 top-0 h-full rounded-full bg-purple-500 transition-all duration-150",
          className,
        )}
      ></div>
      <div className="absolute bottom-0 left-0 top-0 flex h-full w-full items-center justify-center"></div>
    </div>
  );
};

export default ProgressBar;
