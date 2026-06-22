import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface LinkPaginationProps {
  currentPage: number;
  totalPages: number;
}

export const LinkPagination: FunctionComponent<LinkPaginationProps> = ({
  currentPage,
  totalPages,
}) => {
  const router = useRouter();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (start > 1) pages.push(1, -1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) pages.push(-1, totalPages);

    return pages;
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex justify-center items-center gap-2 px-4 py-2 font-medium ${
          currentPage === 1
            ? "cursor-not-allowed opacity-50"
            : "hover:border-t-2 hover:border-t-gray-300"
        }`}
      >
        <FiChevronLeft /> Previous
      </button>

      <div className="hidden md:flex">
        {generatePageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            disabled={page === -1}
            className={`px-4 py-2 font-medium ${
              page === -1 && "cursor-not-allowed opacity-50 "
            } ${
              page === currentPage
                ? "border-t-2 border-t-teal-600 text-teal-600 "
                : "hover:border-t-2 hover:border-t-gray-300"
            }`}
          >
            {page === -1 ? "..." : page}
          </button>
        ))}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex justify-center items-center gap-2 px-4 py-2 font-medium ${
          currentPage === totalPages
            ? "cursor-not-allowed opacity-50"
            : "hover:border-t-2 hover:border-t-gray-300"
        }`}
      >
        Next <FiChevronRight />
      </button>
    </div>
  );
};
