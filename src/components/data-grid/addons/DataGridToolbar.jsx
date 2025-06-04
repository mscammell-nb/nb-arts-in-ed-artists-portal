import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { memo, useCallback } from "react";

/**
 * DataGridToolbar component - Provides search functionality and extra buttons for the DataGrid
 *
 */
const DataGridToolbar = memo(function DataGridToolbar({
  noSearch,
  extraButtons,
  table,
}) {
  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback(
    (event) => {
      table.setGlobalFilter(String(event.target.value));
    },
    [table],
  );

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-2 sm:flex-row",
        noSearch ? "justify-end" : "justify-between",
      )}
      role="search"
      aria-label="Table search and actions"
    >
      {!noSearch && (
        <>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search..."
              value={table.getState().globalFilter ?? ""}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search table"
            />
          </div>

          {extraButtons}
        </>
      )}
    </div>
  );
});

export default DataGridToolbar;
