import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const PageHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const capitalize = (str) => {
    const result = str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return result.join(" ");
  };

  const getPageTitle = (pathname) => {
    const segments = pathname.split("/").filter(Boolean); // Remove empty segments

    if (segments.length > 1) {
      // Check if last segment is a number (ID)
      const lastSegment = segments[segments.length - 1];
      if (!isNaN(lastSegment) && !isNaN(parseFloat(lastSegment))) {
        const basePath = segments[segments.length - 2];
        return `${capitalize(basePath.split("-").join(" "))} #${lastSegment}`;
      }
    }

    // Default behavior for single segments or non-numeric endings
    const path = segments.join(" ").split("-").join(" ");
    return capitalize(path);
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="border-b border-border bg-foreground px-6 py-4">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="rounded-full p-1 transition-colors hover:bg-background"
        >
          <ChevronLeft className="h-5 w-5 text-tertiary" />
        </Button>
        <h1 className="text-2xl font-semibold text-primary">{pageTitle}</h1>
      </div>
    </header>
  );
};

export default PageHeader;
