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
  globalFilter, // Add this
  setGlobalFilter, // Add this
}) {
  // Update the onChange handler to use the passed setter
  const handleSearchChange = useCallback(
    (event) => {
      const value = event.target.value;
      setGlobalFilter(value); // Use the passed setter
      table.setGlobalFilter(value); // Keep this for table functionality
    },
    [table, setGlobalFilter],
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
            <Search className="text-text-tertiary absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""} // Use the passed value
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-border py-2 pl-10 pr-4 focus:border-transparent"
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
