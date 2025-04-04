import { Button } from "@/components/ui/button";
import React, { useCallback, memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Pagination component for the DataGrid
 * Provides navigation controls for paginated data
 * 
 */
const Pagination = memo(function Pagination({table}) {
  // Memoize pagination handlers to prevent unnecessary re-renders
  const goToFirstPage = useCallback(() => table.firstPage(), [table]);
  const goToPreviousPage = useCallback(() => table.previousPage(), [table]);
  const goToNextPage = useCallback(() => table.nextPage(), [table]);
  const goToLastPage = useCallback(() => table.lastPage(), [table]);

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const canGoPrevious = table.getCanPreviousPage();
  const canGoNext = table.getCanNextPage();

  return (
    <div 
      className="flex items-center justify-between"
      role="navigation"
      aria-label="Pagination navigation"
    >
      <div className="text-muted-foreground">
        Showing page {currentPage} of {totalPages}.
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToFirstPage}
          disabled={!canGoPrevious}
          aria-label="Go to first page"
          className={cn(
            !canGoPrevious && "opacity-50 cursor-not-allowed"
          )}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={!canGoPrevious}
          aria-label="Go to previous page"
          className={cn(
            !canGoPrevious && "opacity-50 cursor-not-allowed"
          )}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={!canGoNext}
          aria-label="Go to next page"
          className={cn(
            !canGoNext && "opacity-50 cursor-not-allowed"
          )}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToLastPage}
          disabled={!canGoNext}
          aria-label="Go to last page"
          className={cn(
            !canGoNext && "opacity-50 cursor-not-allowed"
          )}
        >
          Last
        </Button>
      </div>
    </div>
  );
});

export default Pagination;
