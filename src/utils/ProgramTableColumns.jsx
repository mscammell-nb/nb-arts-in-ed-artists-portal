import {
  CaretSortIcon,
  CaretUpIcon,
  CaretDownIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

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

export const programTableColumns = [
  {
    accessorKey: "dateCreated",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Created
        {getSortIcon(column)}
      </Button>
    ),
  },
  {
    accessorKey: "program",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Program
        {getSortIcon(column)}
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        {getSortIcon(column)}
      </Button>
    ),
  },
];
