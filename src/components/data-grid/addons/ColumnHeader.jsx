import { flexRender } from '@tanstack/react-table';
import React from 'react'
import FilterMenu from './FilterMenu';

/**
 * Column header component for the data grid
 * Displays the column title and filter menu if applicable
 */
function ColumnHeader({ header, table }) {
    const { column } = header;
    const title = flexRender(header.column.columnDef.header, header.getContext());
    return (
      <div className="flex items-center px-6 py-3">
        {column.getCanSort() ? (
          // Add role for sortable headers
          <div
            role="button"
            tabIndex={0}
            aria-sort={
              column.getIsSorted()
                ? column.getIsSorted() === "desc"
                  ? "descending"
                  : "ascending"
                : "none"
            }
          >
            {title}
          </div>
          // <React.Fragment>{title}</React.Fragment>
        ) : (
          <div>{title}</div>
        )}
        {column.getCanFilter() && <FilterMenu column={column} table={table} />}
      </div>
    );
  }

export default ColumnHeader
