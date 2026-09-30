import { cn } from '@/lib/twMerge';
import { Checkbox, FormControl, FormLabel } from '@mui/material';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormMessage } from '../FormMessage';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string | React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  column?: boolean;
  longGap?: boolean;
  reverse?: boolean;
  gap?: '2' | '4' | '6' | '8';
  className?: string;
};

/**
 * ToggleSwitchField. A checkbox field component.
 *
 * @param name - The name of the field.
 * @param label - The label of the field.
 * @param required - The required flag of the field.
 * @param disabled - The disabled flag of the field.
 * @param column - The column flag of the field.
 * @param longGap - The long gap flag of the field.
 * @param reverse - The reverse flag of the field.
 * @param gap - The gap of the field.
 * @param className - The class name of the field.
 * @returns A checkbox field component.
 *
 * @example
 * ```tsx
 * <ToggleSwitchField name="isActive" label="Is Active" />
 * ```
 */

export const ToggleSwitchField = <T extends FieldValues>({
  name,
  label,
  disabled = false,
  required = false,
  column = false,
  longGap = false,
  reverse = false,
  gap = '2',
  className,
}: Props<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={className}>
          <FormControl>
            <div
              className={cn(
                'relative flex items-center',
                `gap-${gap}`,
                column ? 'flex-col items-start' : '',
                longGap ? 'justify-between' : '',
              )}
            >
              <ToggleSwitch
                className={cn(reverse ? 'order-1' : 'order-0')}
                onChange={field.onChange}
                id={name}
                checked={field.value}
                disabled={disabled}
              />

              {label && (
                <FormLabel htmlFor={name} className={cn(reverse ? 'order-0' : 'order-1')}>
                  {typeof label === 'string' ? <span>{label}</span> : label}
                  {required && <span className="ml-1 text-red-500">*</span>}
                </FormLabel>
              )}
            </div>
          </FormControl>

          <FormMessage name={name} />
          <p className="ml-6 text-xs mt-1" />
        </div>
      )}
    />
  );
};

ToggleSwitchField.displayName = 'ToggleSwitchField';
