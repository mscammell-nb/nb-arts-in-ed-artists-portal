import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import { Label } from "./ui/label";
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

const EvaluationsDataTable = ({ data, usePagination = false }) => {
  const [sorting, setSorting] = useState([]);
  const [evaluation, setEvaluation] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const columns = [
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
      accessorKey: "inactive",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inactive
          {getSortIcon(column)}
        </Button>
      ),
    },
    {
      accessorKey: "evaluated",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Evaluated
          {getSortIcon(column)}
        </Button>
      ),
    },
    {
      header: "Actions", // Column Header
      id: "actions",
      cell: ({ row }) => (
        <button
          onClick={() => openSheet()}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          Add Evaluation
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: usePagination ? getPaginationRowModel() : null,
    onSortingChange: setSorting,
    globalFilterFn: "includesString",
    state: {
      sorting,
    },
  });

  const openSheet = () => {
    console.log("OPEN");
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEvaluation(""); // Reset input on close
  };

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {usePagination && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">
            Showing page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}.
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              Last
            </Button>
          </div>
        </div>
      )}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <h2 className="mb-4 text-xl font-bold">Add Evaluation</h2>
          <div className="mb-4">
            <Label htmlFor="evaluation">Evaluation</Label>
            <Input
              id="evaluation"
              value={evaluation}
              onChange={(e) => setEvaluation(e.target.value)}
              placeholder="Enter evaluation"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeSheet}>
              Cancel
            </Button>
            <Button onClick={() => {}}>Submit</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EvaluationsDataTable;
