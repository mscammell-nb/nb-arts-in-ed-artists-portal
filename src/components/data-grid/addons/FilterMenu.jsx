import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FilterIcon } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

/**
 * FilterMenu component - Provides filtering capabilities for table columns
 * Adapts to different data types (string, number, boolean)
 *
 */

const FilterMenu = memo(({ column, table }) => {
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
          <Button
            variant="ghost"
            className="rounded p-1 transition-colors hover:bg-gray-200"
            aria-label={`Filter ${column.id}`}
            aria-expanded={column.getIsFiltered() ? "true" : "false"}
            aria-haspopup="menu"
          >
            <FilterIcon
              size={16}
              strokeWidth={2}
              className="text-tertiary-400 h-4 w-4"
            />
            {column.getFilterValue() && (
              <span
                className="ml-1 h-2 w-2 rounded-full bg-blue-500"
                aria-hidden="true"
              ></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <Input
            placeholder="Search..."
            value={columnFilterValue ?? ""}
            onChange={useCallback(
              (e) => column.setFilterValue(e.target.value),
              [column],
            )}
            className="mb-2 h-8 w-full border-none p-2 shadow-none"
            aria-label={`Filter ${column.id} by text`}
          />
          <DropdownMenuSeparator />
          <div className="max-h-52 overflow-y-auto">
            {uniqueVals.length > 0 ? (
              uniqueVals.map((value) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={columnFilterValue === value}
                  onCheckedChange={useCallback(() => {
                    column.setFilterValue(
                      columnFilterValue === value ? undefined : value,
                    );
                  }, [column, columnFilterValue, value])}
                  aria-label={`Filter by ${value}`}
                >
                  {value}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="text-tertiary-500 py-2 text-center text-sm">
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
            className={cn(
              "h-8 px-2 hover:bg-gray-100 data-[state=open]:bg-gray-100",
            )}
            aria-label={`Filter ${column.id} by number range`}
            aria-expanded={column.getIsFiltered() ? "true" : "false"}
            aria-haspopup="menu"
          >
            <FilterIcon className="h-4 w-4" />
            {column.getFilterValue() && (
              <span
                className="ml-1 h-2 w-2 rounded-full bg-blue-500"
                aria-hidden="true"
              ></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="p-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={columnFilterValue?.[0] ?? ""}
              onChange={useCallback(
                (e) => {
                  const val = e.target.value;
                  column.setFilterValue((old) => [
                    val ? parseInt(val, 10) : undefined,
                    old?.[1],
                  ]);
                },
                [column],
              )}
              aria-label={`Minimum value for ${column.id}`}
              className="h-8 w-24 p-2"
            />
            <span>to</span>
            <Input
              type="number"
              placeholder="Max"
              value={columnFilterValue?.[1] ?? ""}
              onChange={useCallback(
                (e) => {
                  const val = e.target.value;
                  column.setFilterValue((old) => [
                    old?.[0],
                    val ? parseInt(val, 10) : undefined,
                  ]);
                },
                [column],
              )}
              aria-label={`Maximum value for ${column.id}`}
              className="h-8 w-24 p-2"
            />
          </div>
          {columnFilterValue?.[0] || columnFilterValue?.[1] ? (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-center text-blue-500"
              onClick={useCallback(
                () => column.setFilterValue(undefined),
                [column],
              )}
              aria-label="Clear number filter"
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
            className={cn(
              "h-8 px-2 hover:bg-gray-100 data-[state=open]:bg-gray-100",
            )}
            aria-label={`Filter ${column.id} by boolean value`}
            aria-expanded={column.getIsFiltered() ? "true" : "false"}
            aria-haspopup="menu"
          >
            <FilterIcon className="h-4 w-4" />
            {column.getFilterValue() && (
              <span
                className="ml-1 h-2 w-2 rounded-full bg-blue-500"
                aria-hidden="true"
              ></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="p-2">
          <div className="max-h-52 overflow-y-auto">
            <DropdownMenuCheckboxItem
              key={true}
              checked={columnFilterValue === true}
              onCheckedChange={useCallback(() => {
                column.setFilterValue(
                  columnFilterValue === true ? undefined : true,
                );
              }, [column, columnFilterValue])}
              aria-label="Filter by True"
            >
              {"True"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              key={false}
              checked={columnFilterValue === false}
              onCheckedChange={useCallback(() => {
                column.setFilterValue(
                  columnFilterValue === false ? undefined : false,
                );
              }, [column, columnFilterValue])}
              aria-label="Filter by False"
            >
              {"False"}
            </DropdownMenuCheckboxItem>
          </div>
          {columnFilterValue?.[0] || columnFilterValue?.[1] ? (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-center text-blue-500"
              onClick={useCallback(
                () => column.setFilterValue(undefined),
                [column],
              )}
              aria-label="Clear boolean filter"
            >
              Clear filter
            </Button>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return null;
});

export default FilterMenu;
