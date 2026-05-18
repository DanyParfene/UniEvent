import ArrowForwardIcon from "../../assets/arrow-forward.svg?react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const contextRange = 2;

    pages.push(1);

    if (currentPage > contextRange + 2) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - contextRange);
    const end = Math.min(totalPages - 1, currentPage + contextRange);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - (contextRange + 1)) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8 md:mt-12 select-none px-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 md:px-4 md:py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
      >
        <ArrowForwardIcon className="fill-primary rotate-180 w-5 h-5" />
      </button>

      <div className="flex items-center gap-1 md:gap-2">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-1 md:px-2 text-gray-400 font-bold"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                currentPage === page
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-gray-200 text-text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 md:px-4 md:py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
      >
        <ArrowForwardIcon className="fill-primary w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
