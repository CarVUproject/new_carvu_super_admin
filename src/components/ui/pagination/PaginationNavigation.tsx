'use client';
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationNavigationProps {
  type?: 'previous' | 'next' | 'page' | 'ellipsis';
  page?: number;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const PaginationNavigation: React.FC<PaginationNavigationProps> = ({
  type,
  page,
  selected,
  disabled,
  onClick,
}) => {
  if (type === 'ellipsis') {
    return (
      <div className="px-3 py-2">
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </div>
    );
  }

  if (type === 'previous' || type === 'next') {
    const isPrev = type === 'previous';
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
          isPrev
            ? 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-800'
            : 'text-white bg-green-600 border border-green-600 hover:bg-green-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isPrev && <ChevronLeft className="w-4 h-4" />}
        {isPrev ? 'Previous' : 'Next'}
        {!isPrev && <ChevronRight className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium rounded-md min-w-[36px] h-[36px] flex items-center justify-center transition-all duration-200
        ${
          selected
            ? 'border border-[#D5D7DA] text-gray-900 bg-white'
            : 'text-gray-700 bg-white border border-transparent hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      {page}
    </button>
  );
};
