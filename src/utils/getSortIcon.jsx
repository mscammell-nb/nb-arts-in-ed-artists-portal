import { CaretDownIcon, CaretSortIcon, CaretUpIcon } from "@radix-ui/react-icons";

const getSortIcon = (column) => {
  switch (column.getIsSorted()) {
    case "asc":
      return <CaretUpIcon className="ml-2 h-4 w-4" />;
    case "desc":
      return <CaretDownIcon className="ml-2 h-4 w-4" />;
    default:
      return <CaretSortIcon className="ml-2 h-4 w-4" />;
  }
};

export default getSortIcon