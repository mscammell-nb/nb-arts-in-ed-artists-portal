import { flexRender } from "@tanstack/react-table";
import React from "react";
import FilterMenu from "./FilterMenu";
import getSortIcon from "@/utils/getSortIcon";
import { Button } from "@/components/ui/button";

/**
 * Column header component for the data grid
 * Displays the column title and filter menu if applicable
 */
function ColumnHeader({ header, table, noFilter, noSort}) {
  const { column } = header;
  const title = flexRender(header.column.columnDef.header, header.getContext());
  return (
    <div className="flex items-center px-6 py-3" onClick={()=> column.toggleSorting()}>
      <div>{title}</div>
      {column.getCanSort() && noSort && <Button type="button" variant="ghost" className="text-center py-1 px-2">{getSortIcon(column)}</Button>}
      {column.getCanFilter() && noFilter && <FilterMenu column={column} table={table} />}
    </div>
  );
}

export default ColumnHeader;
