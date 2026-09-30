'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, Ref, useEffect, useImperativeHandle } from 'react';
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  FormState,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import z, { ZodType } from 'zod';

export type GenericFormRef<T extends FieldValues> = {
  form: UseFormReturn<z.infer<T>, any, undefined>;
  handleSubmit: () => void;
  submit: () => void;
  reset: () => void;
  getValues: () => T;
  setValue: (name: keyof T, value: T[keyof T]) => void;
  formState: FormState<T>;
};

interface GenericFormProps<T extends FieldValues> extends UseGenericFormProps<T> {
  children: ReactNode;
}
export const GenericForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  ref,
  apiError,
}: GenericFormProps<T>) => {
  const { form, handleOnSubmit } = useGenericForm({
    schema,
    defaultValues,
    onSubmit,
    ref,
  });

  /**-UseEffects-**/
  useEffect(() => {
    if (apiError) {
      Object.keys(apiError)?.map((key) => {
        form.setError(key, { message: apiError[key] });
      });
    }
  }, [apiError]);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

  console.log('formErrorsHere', form?.formState?.errors, apiError);

  return (
    <FormProvider {...form}>
      <form
        action=""
        onSubmit={(e) => {
          e.stopPropagation();
          form.handleSubmit(handleOnSubmit)(e);
        }}
      >
        {children}
      </form>
    </FormProvider>
  );
};

GenericForm.displayName = 'GenericForm';

interface UseGenericFormProps<T extends FieldValues> {
  schema: ZodType<T, any, any>;
  defaultValues: DefaultValues<z.infer<T>>;
  onSubmit: (data: SubmitHandler<z.infer<T>>, form: UseFormReturn<z.infer<T>>) => void;
  // ref?: Ref<GenericFormRef<z.infer<T>>>;
  ref?: Ref<GenericFormRef<T>>;
  apiError?: Record<string, any>;
}

export const useGenericForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  ref,
}: UseGenericFormProps<T>) => {
  type FormType = z.infer<typeof schema>;

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
    mode: 'onChange',
  });

  useEffect(() => {
    if (
      !form.formState.isDirty &&
      JSON.stringify(form.getValues()) !== JSON.stringify(defaultValues)
    ) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  useImperativeHandle(ref, () => {
    type TFormValues = z.infer<T>;

    return {
      getValues: form.getValues,
      reset: (values?: Partial<TFormValues>) => form.reset(values as TFormValues),
      setValue: (name: keyof TFormValues, value: TFormValues[keyof TFormValues]) =>
        form.setValue(name as Path<TFormValues>, value),
      formState: form.formState,
      control: form.control,
      handleSubmit: form.handleSubmit(handleOnSubmit),
      submit: form.handleSubmit(handleOnSubmit),
      form: form,
    };
  });

  const handleOnSubmit = (data: FormType) => {
    onSubmit(data, form);
  };

  return {
    form,
    handleOnSubmit,
  };
};
