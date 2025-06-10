import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useCallback } from "react";

/**
 * Enhanced Pagination component with numeric page buttons
 * Shows pages in format: < 1 2 3 ... 9 >
 * Includes page size selector
 * Hides when there is no data to paginate
 */
const Pagination = memo(function Pagination({ table }) {
  // Get pagination state
  const { pageIndex, pageSize } = table.getState().pagination;
  const currentPage = pageIndex + 1;
  const totalPages = table.getPageCount();
  const canGoPrevious = table.getCanPreviousPage();
  const canGoNext = table.getCanNextPage();

  // Check if there's data to paginate
  const rowCount = table.getCoreRowModel().rows.length;

  // Don't render pagination if there's no data or only one page
  if (rowCount === 0 || totalPages === 0) {
    return null;
  }

  // Memoize pagination handlers
  const goToPreviousPage = useCallback(() => table.previousPage(), [table]);
  const goToNextPage = useCallback(() => table.nextPage(), [table]);
  const goToPage = useCallback((page) => table.setPageIndex(page), [table]);

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (value) => {
      table.setPageSize(Number(value));
    },
    [table],
  );

  // Available page size options
  const pageSizeOptions = [10, 20, 30, 40, 50];

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesVisible = 5;
    const ellipsis = "...";

    if (totalPages <= maxPagesVisible) {
      // Show all pages if there are fewer than maxPagesVisible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate range around current page
      const leftSide = Math.floor(maxPagesVisible / 2);
      const rightSide = maxPagesVisible - leftSide - 1;

      // If current page is close to the beginning
      if (currentPage <= leftSide + 1) {
        for (let i = 2; i <= maxPagesVisible - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(ellipsis);
        pageNumbers.push(totalPages);
      }
      // If current page is close to the end
      else if (currentPage >= totalPages - rightSide) {
        pageNumbers.push(ellipsis);
        for (let i = totalPages - maxPagesVisible + 2; i < totalPages; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(totalPages);
      }
      // If current page is in the middle
      else {
        pageNumbers.push(ellipsis);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(ellipsis);
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div
      className="mt-2 flex flex-col gap-4 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
      role="navigation"
      aria-label="Pagination navigation"
    >
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Showing page {currentPage} of {totalPages}
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Rows per page:</p>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousPage}
          disabled={!canGoPrevious}
          aria-label="Previous page"
          className={cn(
            "h-8 w-8 rounded-full p-0",
            !canGoPrevious && "cursor-not-allowed opacity-50",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-primary"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="icon"
              onClick={() => goToPage(page - 1)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={cn(
                "h-8 w-8 rounded-full p-0",
                currentPage === page ? "bg-accent hover:bg-accent/90" : "",
              )}
            >
              {page}
            </Button>
          ),
        )}

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextPage}
          disabled={!canGoNext}
          aria-label="Next page"
          className={cn(
            "h-8 w-8 rounded-full p-0",
            !canGoNext && "cursor-not-allowed opacity-50",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

export default Pagination;
