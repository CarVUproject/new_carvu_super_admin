'use client';
import { GenericForm, GenericFormRef } from '@/components/forms/GenericForm';
import { useRef, useState } from 'react';
import z from 'zod';
import { PlanCardGroup } from './PlanCardField';
import { PlanChangeModal } from './PlanChangeModal';

const plans = [
  {
    value: 'starter',
    title: 'Starter',
    description: 'Perfect for sell used cars',
    price: 150,
    benefits: [
      'Free 1 month trial for new user',
      'Free 1 month trial for new user',
      'Free 1 month trial for new user',
      'Free 1 month trial for new user',
      'Free 1 month trial for new user',
    ],
  },
  {
    value: 'essential',
    title: 'Essential',
    description: 'Advanced plan for professionals',
    price: 350,
  },
  {
    value: 'professional',
    title: 'Professional',
    description: 'Full-featured enterprise solution',
    price: 750,
  },
  {
    value: 'power dealer',
    title: 'Power Dealer',
    description: 'Full-featured enterprise solution',
    price: 2099,
    benefits: [
      'Free 1 month trial for new user',
      'Free 1 month trial for new user',
      'Free 1 month trial for new user',
      'Free 1 month trial for new user',
      'Free 1 month trial for new user',
    ],
  },
];

const PlanFormSchema = z.object({
  plan: z.enum(['starter', 'essential', 'professional', 'power dealer']),
});

export type PlanType = z.infer<typeof PlanFormSchema>;

export const PlanForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<GenericFormRef<PlanType>>(null);

  return (
    <>
      <GenericForm
        onSubmit={async (data) => {
          setIsLoading(true);

          // Simulate API delay
          setTimeout(() => {
            console.log('Form submitted:', data);
            setIsLoading(false);
          }, 1500);
        }}
        schema={PlanFormSchema}
        defaultValues={{ plan: 'starter' }}
        ref={formRef}
      >
        <div className="mt-4">
          <PlanCardGroup<PlanType> name="plan" plans={plans} />
        </div>
        <div className="border-t border-[#EAEBEC] mt-4 pt-4 flex justify-end gap-4">
          <button type="button" className="btn-base" onClick={() => formRef.current?.reset()}>
            Cancel
          </button>

          <button
            type="button"
            className="btn-gradient py-2 px-4"
            onClick={() => setIsModalOpen(true)}
          >
            Change Plan
          </button>
        </div>

        <PlanChangeModal
          closeModal={() => setIsModalOpen(false)}
          open={isModalOpen}
          isLoading={isLoading}
          onConfirm={() => formRef.current?.submit}
          previousPlan={formRef.current?.formState.defaultValues?.plan}
          currentPlan={formRef.current?.getValues().plan}
        />
      </GenericForm>
    </>
  );
};

PlanForm.displayName = 'PlanForm';
