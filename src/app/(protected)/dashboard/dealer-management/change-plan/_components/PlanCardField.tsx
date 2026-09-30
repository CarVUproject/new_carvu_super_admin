'use client';
import { cn } from '@/lib/twMerge';
import { Radio } from '@mui/material';
import { Check } from 'lucide-react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

interface Plan {
  value: string | number;
  title: string;
  description: string;
  price: number;
  benefits?: string[];
}

interface PlanCardGroupProps<T extends FieldValues> {
  name: Path<T>;
  // control: Control<T>;
  plans: Plan[];
}

export function PlanCardGroup<T extends FieldValues>({ name, plans }: PlanCardGroupProps<T>) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="space-y-3">
          {plans.map((plan) => {
            const selected = field.value === plan.value;

            return (
              <div
                key={plan.value}
                className={cn(
                  'p-4 border rounded-xl bg-white shadow-[0_1px_2px_0_rgba(10,13,18,0.05)] cursor-pointer',
                  selected ? 'border-[#8AD0A2]' : 'border-[#EAEBEC]',
                )}
                onClick={() => field.onChange(plan.value)}
              >
                <div className="flex justify-between items-center">
                  {/* Left: Radio + Plan Info */}
                  <div className="flex items-center space-x-3">
                    <Radio
                      {...field}
                      checked={selected}
                      onChange={() => field.onChange(plan.value)}
                      size="small"
                      icon={<div className="border border-[#D5D7DA] size-5 rounded-full"></div>}
                      checkedIcon={
                        <div className="size-5 border-6 border-[#019935] rounded-full grid place-items-center">
                          <div className="size-2 bg-white rounded-full" />
                        </div>
                      }
                      className="text-[#019935]!"
                    />
                    <div className="space-y-1">
                      <h4 className="text-lg/6 text-[#555D6A] font-bold">{plan.title}</h4>
                      <p className="text-xs/4 text-[#717882]">{plan.description}</p>
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="space-x-0.5 mt-1">
                    <span
                      className={cn('text-sm/4.5 text-[#555D6A]', selected && 'text-[#099D01]')}
                    >
                      $
                    </span>
                    <span
                      className={cn(
                        'text-3xl/10 text-[#555D6A] font-bold',
                        selected && 'text-[#099D01]',
                      )}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={cn('text-sm/4.5 text-[#555D6A]', selected && 'text-[#099D01]')}
                    >
                      /month
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                {selected && (
                  <div>
                    {plan?.benefits && (
                      <div className="border-t border-[#EAEBEC] mt-4">
                        <div className="mt-4 space-y-3">
                          {plan?.benefits?.map((b, idx) => (
                            <PlanCardBenefits key={idx} benefit={b} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    />
  );
}

export const PlanCardBenefits = ({ benefit }: { benefit: string }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="size-4 bg-[#3AB134] rounded-full grid place-items-center">
        <Check color="white" size={10} strokeWidth={4} />
      </div>
      <p className="text-xs/4 text-[#555D6A]">{benefit}</p>
    </div>
  );
};

PlanCardBenefits.displayName = 'PlanCardBenefits';
