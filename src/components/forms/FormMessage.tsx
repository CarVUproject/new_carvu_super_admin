'use client';

import { FieldError, FieldPath, FieldValues, useFormContext } from 'react-hook-form';

interface FormMessageProps<T extends FieldValues> {
  name: FieldPath<T>;
}

export function FormMessage<T extends FieldValues>({ name }: FormMessageProps<T>) {
  const {
    formState: { errors },
  } = useFormContext<T>();

  const fieldError = errors[name] as FieldError | undefined;

  if (!fieldError?.message) return null;

  return <p className="mt-1 text-sm text-red-600 font-lato">{fieldError.message}</p>;
}

FormMessage.displayName = 'FormMessage';
