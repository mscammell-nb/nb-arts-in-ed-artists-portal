import { CaretDownIcon } from "@radix-ui/react-icons";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { Button } from "./button";
import { FilterIcon, Loader2, Pencil, Save, X } from "lucide-react";
import { Separator } from "./separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { set } from "react-hook-form";

const FilterMenu = ({ column, table }) => {
  const firstValue = table.getFilteredRowModel().rows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const dataType = typeof firstValue;

  if (dataType === "string") {
    const uniqueVals = useMemo(() => {
      const vals = new Set();
      table.getPreFilteredRowModel().flatRows.forEach((row) => {
        const val = row.getValue(column.id);
        if (val) vals.add(val);
      });
      return [...vals].sort();
    }, [column.id, table]);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <FilterIcon size={16} strokeWidth={2} />
            {column.getFilterValue() && (
              <span className="ml-1 h-2 w-2 rounded-full bg-blue-500"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <Input
            placeholder="Search..."
            value={columnFilterValue ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="mb-2 h-8 w-full p-2"
          />
          <DropdownMenuSeparator />
          <div className="max-h-52 overflow-y-auto">
            {uniqueVals.length > 0 ? (
              uniqueVals.map((value) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={columnFilterValue === value}
                  onCheckedChange={() => {
                    column.setFilterValue(
                      columnFilterValue === value ? undefined : value,
                    );
                  }}
                >
                  {value}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="py-2 text-center text-sm text-gray-500">
                No options available
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  if (dataType === "number") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-gray-100 data-[state=open]:bg-gray-100"
          >
            <FilterIcon className="h-4 w-4" />
            {column.getFilterValue() && (
              <span className="ml-1 h-2 w-2 rounded-full bg-blue-500"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="p-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={columnFilterValue?.[0] ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                column.setFilterValue((old) => [
                  val ? parseInt(val, 10) : undefined,
                  old?.[1],
                ]);
              }}
              className="h-8 w-24 p-2"
            />
            <span>to</span>
            <Input
              type="number"
              placeholder="Max"
              value={columnFilterValue?.[1] ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                column.setFilterValue((old) => [
                  old?.[0],
                  val ? parseInt(val, 10) : undefined,
                ]);
              }}
              className="h-8 w-24 p-2"
            />
          </div>
          {columnFilterValue?.[0] || columnFilterValue?.[1] ? (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-center text-blue-500"
              onClick={() => column.setFilterValue(undefined)}
            >
              Clear filter
            </Button>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  if (dataType === "boolean") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-gray-100 data-[state=open]:bg-gray-100"
          >
            <FilterIcon className="h-4 w-4" />
            {column.getFilterValue() && (
              <span className="ml-1 h-2 w-2 rounded-full bg-blue-500"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="p-2">
          <div className="max-h-52 overflow-y-auto">
            <DropdownMenuCheckboxItem
              key={true}
              checked={columnFilterValue === true}
              onCheckedChange={() => {
                column.setFilterValue(
                  columnFilterValue === true ? undefined : true,
                );
              }}
            >
              {"True"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              key={false}
              checked={columnFilterValue === false}
              onCheckedChange={() => {
                column.setFilterValue(
                  columnFilterValue === false ? undefined : false,
                );
              }}
            >
              {"False"}
            </DropdownMenuCheckboxItem>
          </div>
          {columnFilterValue?.[0] || columnFilterValue?.[1] ? (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-center text-blue-500"
              onClick={() => column.setFilterValue(undefined)}
            >
              Clear filter
            </Button>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return null;
};

function ColumnHeader({ header, table }) {
  const { column } = header;
  const title = flexRender(header.column.columnDef.header, header.getContext());
  return (
    <div className="flex items-center px-6 py-3">
      {column.getCanSort() ? (
        <React.Fragment>{title}</React.Fragment>
      ) : (
        <div>{title}</div>
      )}
      {column.getCanFilter() && <FilterMenu column={column} table={table} />}
    </div>
  );
}

function Table({
  data,
  columns,
  CustomAddComponent = null,
  addButtonText = "Add New",
  sheetProps = null,
  usePagination = false,
  allowExport = null,
  tableTitle = null,
  customButtons = [],
  readOnly = false,
  updateFunction = (e) => {},
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editableData, setEditableData] = useState([...data]);
  const [form, setForm] = useState({});

  const handleCellChange = (rowIndex, columnId, value, setValue, recordId) => {
    const copy = form;
    copy[recordId] = { ...copy[recordId], [columnId]: value, recordId };
    setForm(copy);
    setValue(value);
  };

  const editableColumns = columns.map((column) => ({
    ...column,
    cell: editing
      ? ({ row, column, getValue }) => {
          const originalValue = getValue();
          const [inputValue, setInputValue] = useState(getValue());
          const rowIndex = row.index;
          const columnId = column.id;

          return (
            <Input
              value={inputValue}
              onChange={(e) => {
                handleCellChange(
                  rowIndex,
                  columnId,
                  e.target.value,
                  setInputValue,
                  row.original.id,
                );
              }}
              className={`w-full rounded border border-gray-200 p-1 ${inputValue === originalValue ? "bg-white" : "bg-yellow-200"}`}
            />
          );
        }
      : column.cell,
  }));

  const table = useReactTable({
    data,
    columns: editableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: usePagination ? getPaginationRowModel() : null,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const handleAddNew = () => {
    setSheetOpen(true);
  };

  const clearAllFilters = () => {
    table.resetColumnFilters();
    setGlobalFilter("");
  };

  const hasFilters =
    table.getState().columnFilters.length > 0 || !!globalFilter;

  const handleSaveChanges = () => {
    updateFunction(form);
    setEditing(false);
  };
  const handleCancelChanges = () => {
    setEditing(false);
  };

  return (
    <div className="w-full overflow-hidden rounded bg-white p-3">
      {tableTitle && (
        <>
          <p className="mb-3 text-2xl font-bold">{tableTitle}</p>
          <Separator className="my-3" />
        </>
      )}
      <div className="flex flex-col items-center justify-between gap-2 pb-3 sm:flex-row">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          className="w-full max-w-[600px] bg-gray-50"
        />
        <div className="flex w-full flex-col items-center justify-start gap-4 sm:w-auto sm:flex-row">
          {hasFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="whitespace-nowrap text-gray-500"
            >
              Clear Filters
            </Button>
          )}
          {allowExport && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full max-w-[600px] items-center rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-all hover:border-gray-500 sm:w-auto">
                <span className="mr-2 text-nowrap text-sm">Export as</span>
                <CaretDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>CSV</DropdownMenuItem>
                <DropdownMenuItem>JSON</DropdownMenuItem>
                <DropdownMenuItem>XLSX</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {customButtons && customButtons.map((button) => button)}
          {CustomAddComponent && (
            <Button
              className=" w-full max-w-[600px] rounded bg-blue-500 px-3 text-white sm:w-auto"
              onClick={handleAddNew}
              disabled={sheetProps?.loading}
            >
              {sheetProps?.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>{addButtonText}</span>
            </Button>
          )}
          {!readOnly && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="cursor-pointer rounded border border-gray-300 p-2 text-gray-400 transition-all hover:border-gray-600 hover:text-gray-600"
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  <Pencil size={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enable Editing</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      {editing && (
        <div className="flex items-center gap-3 pb-3">
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            <span>Save</span>
          </Button>
          <Button variant="secondary" onClick={handleCancelChanges}>
            <X className="mr-2 h-4 w-4" />
            <span>Cancel</span>
          </Button>
        </div>
      )}

      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan} scope="col">
                    <ColumnHeader header={header} table={table} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-6 py-4 ${cell.column.id === "programName" ? "whitespace-nowrap font-medium text-gray-900 dark:text-white" : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
      {CustomAddComponent && (
        <CustomAddComponent
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          sheetProps={sheetProps}
        />
      )}
    </div>
  );
}

export default Table;
