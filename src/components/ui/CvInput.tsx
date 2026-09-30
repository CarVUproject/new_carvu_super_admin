'use client';

import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

type CvInputProps = {
  error?: boolean;
  label?: string;
  labelClassNames?: string;
} & React.ComponentProps<'input'>;

const CvInput: React.FC<CvInputProps> = ({
  className,
  error,
  label,
  labelClassNames,
  type,
  value,
  ...props
}) => {
  const [showHidePassword, setShowHidePassword] = useState(false);

  return (
    <div className="grid gap-2">
      {label ? (
        <label className={cn('text-cv-gray-500 font-semibold', labelClassNames)}>{label}</label>
      ) : null}
      <div className="relative grid">
        <input
          className={cn(
            'w-full rounded-[12px] border border-[#D5D7DA] bg-white px-3.5 py-2.5 inset-shadow-xs transition-colors focus:border-cv-gray-400 focus:outline-none hover:border-cv-gray-400 disabled:opacity-50',
            error && 'border-[#EE9E99]',
            type === 'password' && 'pr-12',
            className,
          )}
          type={type === 'password' ? (showHidePassword ? 'text' : 'password') : type}
          {...props}
          {...(value !== undefined ? { value } : {})}
        />
        {type === 'password' ? (
          <div className="absolute right-0 top-0 flex h-full items-center pr-3.5">
            {showHidePassword ? (
              <EyeOff
                className="size-5 cursor-pointer text-cv-gray-300"
                onClick={() => setShowHidePassword((previous) => !previous)}
              />
            ) : (
              <Eye
                className="size-5 cursor-pointer text-cv-gray-300"
                onClick={() => setShowHidePassword((previous) => !previous)}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CvInput;
