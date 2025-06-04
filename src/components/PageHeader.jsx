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
  const pageTitle = capitalize(
    location.pathname.replace(/\//, "").split("-").join(" "),
  );

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
      </div>
    </header>
  );
};

export default PageHeader;
