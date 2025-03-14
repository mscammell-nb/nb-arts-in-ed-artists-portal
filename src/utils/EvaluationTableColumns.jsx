import { Button } from "@/components/ui/button";
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons";

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

export const evalTableColumns = [
  {
    accessorKey: "programName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Program
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
  },
  {
    accessorKey: "evaluationDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Evaluation Date
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "servicePerformed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Service Performed
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "approverName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Approver Name
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "guideUsed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Guide Used
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "studentsAttentive",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Attentive?
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "studentConduct",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Conduct?
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "teacherRemained",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Teacher Remained?
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "spaceSetUp",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Space Set Up?
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "equipmentUsed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Equipment
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "onSchedule",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        On Schedule
        {getSortIcon(column)}
      </Button>
    ),
    cell: (info) => <p className="text-center">{info.getValue()}</p>,
  },
  {
    accessorKey: "additionalComments",
    header: ({ column }) => <p className="text-nowrap">Additional Comments</p>,
    cell: (info) => <p className="text-left">{info.getValue()}</p>,
  },
];
