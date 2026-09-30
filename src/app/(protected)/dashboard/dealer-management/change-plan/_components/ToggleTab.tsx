'use client';
import { cn } from '@/lib/twMerge';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

interface ToggleTabs {
  tabs: string[];
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

/**
 * Reusable Tabs component with hidden indicator and custom styles
 */
export const ToggleTabs = ({ tabs, defaultValue = 0, onChange, className }: ToggleTabs) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Box
      className={cn(
        'p-[4.71px] rounded-[6.29px] bg-[#F3F4F5] border-[0.79px] border-[#EAEBEC] w-fit',
        className,
      )}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="standard"
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        {tabs.map((tabLabel, index) => (
          <Tab
            key={index}
            label={tabLabel}
            className={cn(
              'normal-case! px-3! text-[#717882]! text-sm/4.5! font-semibold! font-lato!',
              value === index
                ? 'btn-gradient! text-white!'
                : 'bg-transparent !hover:bg-[#e9ecef] antialiased',
            )}
          />
        ))}
      </Tabs>
    </Box>
  );
};

ToggleTabs.displayName = 'ToggleTabs';
