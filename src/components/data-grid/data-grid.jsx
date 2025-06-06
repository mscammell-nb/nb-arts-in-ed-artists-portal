import { cn } from "@/lib/utils";
import { CaretDownIcon } from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Braces,
  FileText,
  Loader2,
  Pencil,
  Save,
  Trash,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ColumnHeader from "./addons/ColumnHeader";
import DataGridToolbar from "./addons/DataGridToolbar";
import editableColumns from "./addons/EditableCell";
import NoResultsFound from "./addons/NoResults";
import Pagination from "./addons/Pagination";

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
  noFilter = false,
  noSort = false,
  rowSpecificEditing = false,
  rowDelete = false,
  handleRowDelete = () => {},
  handleRowDeleteObject = {},
  isDeleteLoading = false,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  let columnsCopy = [...columns];

  if (rowDelete) {
    columnsCopy = [
      ...columns,
      {
        header: ({ column }) => (
          <p className="text-center font-semibold">Delete</p>
        ),
        id: "delete",
        cell: ({ row }) => (
          <div className="grid w-full place-items-center">
            <Button
              type="button"
              className={
                "border-red-700 bg-red-500 text-sm text-white hover:border-red-400 hover:bg-red-300 hover:text-white"
              }
              onClick={() =>
                handleRowDelete({
                  ...handleRowDeleteObject,
                  where: `{3.EX.${row.original.id}}`,
                })
              }
              variant="outline"
              isLoading={isDeleteLoading}
            >
              <Trash size={14} />
            </Button>
          </div>
        ),
      },
    ];
  }

  const table = useReactTable({
    data,
    columns: editableColumns(
      columnsCopy,
      setEditing,
      editing,
      editableFields,
      form,
      setForm,
      rowSpecificEditing,
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
          className="text-tertiary whitespace-nowrap"
        >
          Clear Filters
        </Button>
      )}
      {allowExport && (
        <DropdownMenu>
          <DropdownMenuTrigger className="text-tertiary flex w-full max-w-[600px] items-center rounded-lg border border-border px-3 py-2 transition-all hover:border-gray-500 sm:w-auto">
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
          className=" w-full max-w-[600px] rounded bg-accent px-3 text-white hover:bg-accent/80 sm:w-auto"
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
              className="text-tertiary cursor-pointer rounded border border-border p-2 transition-all hover:border-[hsl(var(--text-secondary))] hover:text-secondary"
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
    <div className="w-full overflow-hidden rounded-lg border border-border bg-foreground px-0 py-3 shadow-sm">
      {tableTitle ? (
        <>
          <div className="border-b border-border p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">{tableTitle}</span>
              {extraButtons && extraButtons}
            </div>
          </div>
          {!noSearch && (
            <div className="flex items-center justify-between border-b border-border p-6">
              <DataGridToolbar
                noSearch={noSearch}
                table={table}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
              {editing && (
                <div className="flex items-center gap-3 pb-3">
                  <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Save</span>
                  </Button>
                  <Button variant="outline" onClick={handleCancelChanges}>
                    <X className="mr-2 h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        !noSearch && (
          <div className="flex items-center justify-between border-b border-border p-6">
            <DataGridToolbar
              noSearch={noSearch}
              table={table}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            {extraButtons && extraButtons}
            {editing && (
              <div className="ml-4 flex items-center gap-3">
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
          </div>
        )
      )}

      {/* Table container with accessibility attributes */}
      <div className="relative overflow-x-auto">
        <table
          className=" w-full"
          role="grid"
          aria-labelledby={tableTitle ? "table-title" : undefined}
        >
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    scope="col"
                    className="px-6 py-4 text-left"
                  >
                    <ColumnHeader
                      header={header}
                      table={table}
                      noFilter={noFilter}
                      noSort={noSort}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border bg-foreground text-sm">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-6 py-4",
                        cell.column.id === "programName" &&
                          "whitespace-nowrap font-medium text-secondary",
                      )}
                      style={{ wordBreak: "break-word" }}
                      role="gridcell"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <NoResultsFound message="No matching records found" />
            )}
          </tbody>
        </table>
      </div>
      {legend && legend}
      {usePagination && <Pagination table={table} />}
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
