import { cn } from '@/lib/twMerge';
import { Checkbox, FormControl, FormLabel } from '@mui/material';
import { Check } from 'lucide-react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

type Option = {
  text: string;
  value: string;
};

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
  column?: boolean;
  required?: boolean;
  showError?: boolean;
};

export const CheckboxGroupField = <T extends FieldValues>({
  name,
  label,
  options,
  className,
  disabled,
  column = true,
  required,
  showError = true,
}: Props<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value: string[]) =>
          required ? (value && value.length > 0 ? true : 'At least one option is required') : true,
      }}
      render={({ field, fieldState }) => {
        const handleToggle = (optionValue: string) => {
          const value = (field.value as string[]) || [];
          if (value.includes(optionValue)) {
            field.onChange(value.filter((v) => v !== optionValue));
          } else {
            field.onChange([...value, optionValue]);
          }
        };

        return (
          <div className={className}>
            {label && (
              <FormLabel>
                <span>{label}</span>
                {required && <span className="ml-1 text-red-500">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <div className={cn('flex gap-4', column ? 'flex-col' : 'flex-row flex-wrap')}>
                {options.map((option) => {
                  const isChecked = (field.value as string[])?.includes(option.value) ?? false;

                  return (
                    <div key={option.value} className="flex items-center gap-2">
                      <Checkbox
                        icon={
                          <span className="size-4  border-2 border-[#2B3545] rounded-sm "></span>
                        }
                        checkedIcon={
                          <span className="bg-[#3AB134] size-4 rounded-sm flex items-center justify-center">
                            <Check color="white" size={14} className="rounded-lg" />
                          </span>
                        }
                        id={option.value}
                        checked={isChecked}
                        onChange={() => handleToggle(option.value)}
                        disabled={disabled}
                        className="!rounded-full !m-0 !p-0"
                      />
                      <label
                        htmlFor={option.value}
                        className="text-base text-[#2B3545] font-lato leading-none"
                      >
                        {option.text}
                      </label>
                    </div>
                  );
                })}
              </div>
            </FormControl>

            {showError && fieldState.error && (
              <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

CheckboxGroupField.displayName = 'CheckboxGroupField';
