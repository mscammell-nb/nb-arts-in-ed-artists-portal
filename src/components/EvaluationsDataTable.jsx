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
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import EvaluationPage from "@/pages/EvaluationPage";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { getCurrentFiscalYear } from "@/utils/utils";
import { Loader2 } from "lucide-react";
import { evalTableColumns } from "@/utils/EvaluationTableColumns";

const EvaluationsDataTable = ({ data, usePagination = false }) => {
  const {
    data: programsData,
    isLoading: isProgramsDataLoading,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_PROGRAMS_TABLE_ID,
    select: [1, 3, 8, 11, 16, 31, 32, 33],
    where: `{8.EX.${localStorage.getItem("artistRecordId")}}AND{16.EX.${getCurrentFiscalYear()}}`,
  });
  const {
    data: contracts,
    isLoading: isContractsLoading,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_CONTRACTS_TABLE_ID,
    select: [1, 3, 8, 10, 12, 13, 15, 16],
    where: `{9.EX.${localStorage.getItem("artistRecordId")}}AND{15.EX.${getCurrentFiscalYear()}}`,
  });
  const [sorting, setSorting] = useState([]);
  const [row, setRow] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  const table = useReactTable({
    data,
    columns: evalTableColumns,
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
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            setRow(row);
            openSheet();
          }}
          disabled={isContractsLoading || isProgramsDataLoading}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          {(isContractsLoading || isProgramsDataLoading) && (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          )}
          Add Evaluation
        </Button>
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} className="z-20">
        <SheetContent className="sm:max-w-1/3 w-1/3 overflow-y-scroll">
          <SheetTitle className="text-3xl">Evaluation Form</SheetTitle>
          <SheetDescription className="hidden">
            Evaluation Form
          </SheetDescription>
          {!isContractsLoading && !isProgramsDataLoading && (
            <EvaluationPage
              contractData={contracts.data}
              programData={programsData.data}
              closeSheet={closeSheet}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EvaluationsDataTable;