'use client';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { ChangeEvent, useState } from 'react';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/twMerge';

interface SearchInputBoxProps {
  className?: string;
  iconClassName?: string;
}

export const SearchInputBox = ({ className, iconClassName }: SearchInputBoxProps) => {
  const { submitSearch, updateSearchParams } = useUpdateSearchParams();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitSearch('q', searchValue);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    updateSearchParams({ q: null });
  };

  return (
    <div className={cn('relative w-[350px]', className)}>
      <SearchIcon
        className={cn(
          'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#2B3545]',
          iconClassName,
        )}
      />
      <input
        placeholder="Search..."
        className="pl-10 w-full  px-3 py-3 border border-[#D5D7DA] shadow-xs rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-lato"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        value={searchValue}
      />

      {searchValue && (
        <button
          onClick={handleClearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BDC0C5] hover:text-gray-600 transition-colors"
        >
          <X className="!w-5 !h-5" />
        </button>
      )}
    </div>
  );
};

SearchInputBox.displayName = 'SearchInputBox';
