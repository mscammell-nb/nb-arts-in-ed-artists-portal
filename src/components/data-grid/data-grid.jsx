import { CaretDownIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Braces, FileText, Loader2, Pencil, Save, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import editableColumns from "./addons/EditableCell";
import Pagination from "./addons/Pagination";
import DataGridToolbar from "./addons/DataGridToolbar";
import { cn } from "@/lib/utils";
import ColumnHeader from "./addons/ColumnHeader";

/**
 * DataGrid component - table component with sorting, filtering, pagination, and editing
 *
 */
function DataGrid({
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
  editableFields = new Map(),
  noSearch = false,
  legend = null,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const table = useReactTable({
    data,
    columns: editableColumns(
      columns,
      setEditing,
      editing,
      editableFields,
      form,
      setForm,
    ),
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

  // Memoize event handlers to prevent unnecessary re-renders
  const handleAddNew = useCallback(() => {
    setSheetOpen(true);
  }, []);

  const clearAllFilters = useCallback(() => {
    table.resetColumnFilters();
    setGlobalFilter("");
  }, [table]);

  const hasFilters =
    table.getState().columnFilters.length > 0 || !!globalFilter;

  const handleSaveChanges = useCallback(() => {
    updateFunction(form);
    setEditing(false);
  }, [form, updateFunction]);

  const handleCancelChanges = useCallback(() => {
    setEditing(false);
  }, []);

  /**
   * Exports the current table data to the specified format
   */
  const handleExport = useCallback(
    (format) => {
      // Get the visible data from the table
      const data = table.getFilteredRowModel().rows.map((row) => {
        const rowData = {};
        // Only include visible columns in the export
        table.getAllColumns().forEach((column) => {
          if (column.getIsVisible()) {
            rowData[column.id] = row.getValue(column.id);
          }
        });
        return rowData;
      });

      let content;
      let filename;
      let mimeType;

      // Format the data based on the export type
      switch (format) {
        case "csv":
          // Create CSV content
          const headers = Object.keys(data[0] || {}).join(",");
          const csvRows = data.map((row) => Object.values(row).join(","));
          content = [headers, ...csvRows].join("\n");
          filename = `export-${Date.now()}.csv`;
          mimeType = "text/csv";
          break;
        case "json":
          // Create JSON content
          content = JSON.stringify(data, null, 2);
          filename = `export-${Date.now()}.json`;
          mimeType = "application/json";
          break;
        default:
          alert("Error exporting file");
      }
      // Create a download link and trigger it
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [table],
  );
  const extraButtons = (
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
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              <FileText className="mr-2 h-4 w-4" />
              <span>CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>
              <Braces className="mr-2 h-4 w-4" />
              <span>JSON</span>
            </DropdownMenuItem>
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
  );
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-white p-3 shadow">
      {(tableTitle || (!noSearch && extraButtons)) && (
        <>
          <div className="flex w-full items-center justify-between">
            {tableTitle && (
              <p className="mb-3 text-2xl font-bold">{tableTitle}</p>
            )}
            {noSearch && extraButtons}
          </div>
          <Separator className="my-3" />
        </>
      )}
      <DataGridToolbar
        noSearch={noSearch}
        extraButtons={extraButtons}
        table={table}
      />
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

      {/* Table container with accessibility attributes */}
      <div className="relative overflow-x-auto">
        <table
          className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right"
          role="grid"
          aria-labelledby={tableTitle ? "table-title" : undefined}
        >
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
                    className={cn(
                      "px-6 py-4",
                      cell.column.id === "programName" &&
                        "whitespace-nowrap font-medium text-gray-900 dark:text-white",
                    )}
                    role="gridcell"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {usePagination && <Pagination table={table} />}
      {legend && legend}
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

export default DataGrid;
