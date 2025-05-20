import { Button } from "@/components/ui/button";
import getSortIcon from "@/utils/getSortIcon";
import { flexRender } from "@tanstack/react-table";
import FilterMenu from "./FilterMenu";

/**
 * Column header component for the data grid
 * Displays the column title and filter menu if applicable
 */
function ColumnHeader({ header, table, noFilter, noSort }) {
  const { column } = header;
  const title = flexRender(header.column.columnDef.header, header.getContext());
  return (
    <div
      className="flex items-center py-3"
      onClick={() => column.toggleSorting()}
    >
      {column.getCanFilter() && !noFilter && (
        <FilterMenu column={column} table={table} />
      )}
      <div className="text-nowrap font-semibold">{title}</div>
      {column.getCanSort() && !noSort && (
        <Button type="button" variant="ghost" className="px-2 py-1 text-center">
          {getSortIcon(column)}
        </Button>
      )}
    </div>
  );
}

export default ColumnHeader;
