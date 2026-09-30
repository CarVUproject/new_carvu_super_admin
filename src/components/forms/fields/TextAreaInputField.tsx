import { cn } from '@/lib/twMerge';
import { FormControl, FormLabel, TextareaAutosize } from '@mui/material';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormMessage } from '../FormMessage';

type TextAreaInputFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string | React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};
export const TextAreaInputField = <T extends FieldValues>({
  name,
  label,
  className,
  placeholder,
  required = false,
  disabled = false,
}: TextAreaInputFieldProps<T>) => {
  const form = useFormContext();
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <div className="">
          <FormControl className="w-full">
            {label && (
              <FormLabel>
                <label className="text-base/5.5 text-[#2B3545] font-semibold">
                  {label} {required && <span className="text-[#019935]">*</span>}
                </label>
              </FormLabel>
            )}
            <TextareaAutosize
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              id={name}
              className={cn(
                '!w-full  px-3.5! py-2.5! mt-1.5 min-h-23 rounded-lg bg-white border border-[#D5D7DA] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] focus:outline-1  focus:outline-[#088F01]',
                className,
              )}
            />
          </FormControl>

          <FormMessage name={name} />
        </div>
      )}
    />
  );
};

TextAreaInputField.displayName = 'TextAreaInputField';
