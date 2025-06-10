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
    <div className="flex items-center space-x-1 text-xs font-medium uppercase tracking-wider text-primary">
      {column.getCanFilter() && !noFilter && (
        <FilterMenu column={column} table={table} />
      )}
      {column.getCanSort() && !noSort ? (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="flex items-center space-x-1 px-2 text-xs font-medium uppercase tracking-wider hover:text-tertiary"
        >
          <div className="text-nowrap">{title}</div>

          {getSortIcon(column)}
        </Button>
      ) : (
        <div className="text-nowrap">{title}</div>
      )}
    </div>
  );
}

export default ColumnHeader;
