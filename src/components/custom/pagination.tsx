import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export const Pagination = ({
  currentPage,
  totalPages,
  setPage,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-xs text-muted-foreground">
        Halaman {currentPage} / {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(1)}
          disabled={currentPage === 1}
        >
          « Awal
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ‹ Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next ›
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Akhir »
        </Button>
      </div>
    </div>
  );
};
