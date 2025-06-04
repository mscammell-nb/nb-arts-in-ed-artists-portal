import { cn } from "@/lib/utils";

const Spinner = ({ classname = null }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 text-primary",
        classname,
      )}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-lighter border-t-transparent text-blue-600"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Spinner;
