import { FormControl, FormLabel, Input } from '@mui/material';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormMessage } from '../FormMessage';
import { cn } from '@/lib/twMerge';

type TextInputFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string | React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  type?: string;
  placeholder?: string;
};
export const TextInputField = <T extends FieldValues>({
  name,
  label,
  className,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
}: TextInputFieldProps<T>) => {
  const form = useFormContext();
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="">
          <FormControl className="w-full">
            {label && (
              <FormLabel>
                <label className="text-base text-[#2B3545] font-semibold">
                  {label} {required && <span className="text-[#019935]">*</span>}
                </label>
              </FormLabel>
            )}
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              id={name}
              fullWidth
              disableUnderline
              margin="none"
              className={cn(
                '!w-full  !py-2.5 px-3.5 !mt-1.5 rounded-md bg-white border border-[#EAEBEC] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]',
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

TextInputField.displayName = 'TextInputField';
