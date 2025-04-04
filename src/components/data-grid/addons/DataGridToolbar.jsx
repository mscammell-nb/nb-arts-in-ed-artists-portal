import { Input } from '@/components/ui/input'
import React, { useCallback, memo } from 'react'
import { cn } from '@/lib/utils'

/**
 * DataGridToolbar component - Provides search functionality and extra buttons for the DataGrid
 * 
 */
const DataGridToolbar = memo(function DataGridToolbar({noSearch, extraButtons, table}) {
  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback((event) => {
    table.setGlobalFilter(String(event.target.value));
  }, [table]);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 pb-3 sm:flex-row",
        noSearch ? "justify-end" : "justify-between"
      )}
      role="search"
      aria-label="Table search and actions"
    >
      {!noSearch && (
        <>
          <Input
            placeholder="Search..."
            value={table.getState().globalFilter ?? ""}
            onChange={handleSearchChange}
            className="w-full max-w-[600px] bg-gray-50"
            aria-label="Search table"
          />
          {extraButtons}
        </>
      )}
    </div>
  )
});

export default DataGridToolbar
