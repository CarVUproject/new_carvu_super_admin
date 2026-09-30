'use client';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInputBox } from '@/components/ui/SearchInputBox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { ChevronDown } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

export const DealerManagementHeader = () => {
  const { control } = useForm({
    defaultValues: {
      sortBy: '',
      search: '',
    },
  });

  return (
    <PageHeader
      title="Dealer List"
      subtitle="View and manage all registered dealers."
      rightSlot={
        <form className="flex items-center space-x-4">
          <SearchInputBox className="w-[250px]" iconClassName="w-6 h-6" />

          <Controller
            name="sortBy"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                IconComponent={ChevronDown}
                variant="outlined"
                sx={{
                  py: 1.3,
                  px: 2,
                  borderRadius: '8px',
                  color: '#555D6A',
                  fontSize: '16px',
                  '& .MuiSelect-select': {
                    padding: 0,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00c951',
                    borderWidth: '2px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D5D7DA',
                  },
                  '& .MuiSelect-icon': {
                    top: '25%',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00c951',
                  },
                }}
              >
                <MenuItem value="">
                  <p className="text-[#555D6A] text-base/5.5">Sort By</p>
                </MenuItem>
                <MenuItem value="asc">ASC</MenuItem>
                <MenuItem value="desc">DES</MenuItem>
              </Select>
            )}
          />
        </form>
      }
    />
  );
};

DealerManagementHeader.displayName = 'DealerManagementHeader';
