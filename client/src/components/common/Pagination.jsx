import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalEmployees = 0,
  limit = 10,
  onPageChange,
}) => {
  if (totalEmployees === 0) return null;

  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, totalEmployees);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-[#FAFBF9] border border-[#E2E4DE] rounded-md px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#636B65] shadow-2xs">
      <div>
        Showing <strong className="text-[#191C1A]">{startRecord}</strong> to{' '}
        <strong className="text-[#191C1A]">{endRecord}</strong> of{' '}
        <strong className="text-[#191C1A]">{totalEmployees}</strong> employee records
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1 rounded text-[#5C625E] hover:text-[#191C1A] hover:bg-[#EEF0EC] border border-[#D5D8D3] bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {getPageNumbers().map((pageNum, idx) => {
          if (pageNum === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 text-[#8C938D]">
                ...
              </span>
            );
          }

          const isActive = pageNum === currentPage;
          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`px-2.5 py-0.5 rounded text-xs font-medium border transition-colors ${
                isActive
                  ? 'bg-[#54745D] text-white border-[#486350]'
                  : 'bg-white text-[#2C322E] border-[#D5D8D3] hover:bg-[#F7F7F5]'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1 rounded text-[#5C625E] hover:text-[#191C1A] hover:bg-[#EEF0EC] border border-[#D5D8D3] bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

