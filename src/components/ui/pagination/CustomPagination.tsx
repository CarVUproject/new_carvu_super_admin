'use client';
import React, { useState } from 'react';
import { PaginationNavigation } from './PaginationNavigation';

interface CustomPaginationProps {
  count?: number;
  page?: number;
  onChange?: (event: any, page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  count = 10,
  page = 1,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
}) => {
  const [currentPage, setCurrentPage] = useState(page);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= count && newPage !== currentPage) {
      setCurrentPage(newPage);
      onChange?.(null, newPage);
    }
  };

  const generatePaginationItems = () => {
    const items: any[] = [];

    items.push({ type: 'previous', page: currentPage - 1, disabled: currentPage === 1 });

    for (let i = 1; i <= Math.min(boundaryCount, count); i++)
      items.push({ type: 'page', page: i, selected: i === currentPage });

    const leftSiblingIndex = Math.max(currentPage - siblingCount, boundaryCount + 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, count - boundaryCount);

    if (leftSiblingIndex > boundaryCount + 1) items.push({ type: 'ellipsis' });

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++)
      items.push({ type: 'page', page: i, selected: i === currentPage });

    if (rightSiblingIndex < count - boundaryCount) items.push({ type: 'ellipsis' });

    for (let i = Math.max(count - boundaryCount + 1, boundaryCount + 1); i <= count; i++)
      items.push({ type: 'page', page: i, selected: i === currentPage });

    items.push({ type: 'next', page: currentPage + 1, disabled: currentPage === count });

    return items;
  };

  const paginationItems = generatePaginationItems();

  return (
    <div className="flex items-center justify-between w-full pt-4 mt-6 bg-white border-t border-[#E9EAEB]">
      <div className="flex gap-2">
        {paginationItems
          .filter((item) => item.type === 'previous')
          .map((item, i) => (
            <PaginationNavigation key={i} {...item} onClick={() => handlePageChange(item.page)} />
          ))}
      </div>

      <div className="flex items-center gap-1">
        {paginationItems
          .filter((item) => item.type === 'page' || item.type === 'ellipsis')
          .map((item, i) => (
            <PaginationNavigation
              key={i}
              {...item}
              onClick={() => item.page && handlePageChange(item.page)}
            />
          ))}
      </div>

      <div className="flex gap-2">
        {paginationItems
          .filter((item) => item.type === 'next')
          .map((item, i) => (
            <PaginationNavigation key={i} {...item} onClick={() => handlePageChange(item.page)} />
          ))}
      </div>
    </div>
  );
};
