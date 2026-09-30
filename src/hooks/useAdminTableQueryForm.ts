'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  useForm,
  type DefaultValues,
  type Path,
  type PathValue,
  type Resolver,
  type UseFormReturn,
} from 'react-hook-form';
import { z } from 'zod';

type QueryFormValues = Record<string, string>;

type UseAdminTableQueryFormOptions<TValues extends QueryFormValues> = {
  defaultValues: TValues;
  filterKeys: Array<keyof TValues & string>;
};

type UseAdminTableQueryFormResult<TValues extends QueryFormValues> = {
  form: UseFormReturn<TValues>;
  queryValues: TValues;
  queryParams: TValues & { page: number };
  page: number;
  activeFilterCount: number;
  hasSearch: boolean;
  setField: <TKey extends keyof TValues & string>(key: TKey, value: TValues[TKey]) => void;
  setPage: (page: number) => void;
  applySearch: () => void;
  clearSearch: () => void;
  applyFilters: () => void;
  resetFilters: () => void;
};

function createStringSchema<TValues extends QueryFormValues>(defaultValues: TValues) {
  const shape = Object.keys(defaultValues).reduce<Record<string, z.ZodString>>((schema, key) => {
    schema[key] = z.string();
    return schema;
  }, {});

  return z.object(shape) as unknown as z.ZodType<TValues, TValues>;
}

function readPage(searchParams: URLSearchParams) {
  const rawPage = Number(searchParams.get('page') ?? 1);

  if (!Number.isFinite(rawPage) || rawPage < 1) {
    return 1;
  }

  return Math.floor(rawPage);
}

function readValuesFromParams<TValues extends QueryFormValues>(
  defaultValues: TValues,
  searchParams: URLSearchParams,
) {
  const values = { ...defaultValues };

  Object.keys(defaultValues).forEach((key) => {
    values[key as keyof TValues] = (searchParams.get(key) ?? '') as TValues[keyof TValues];
  });

  return values;
}

export function useAdminTableQueryForm<TValues extends QueryFormValues>({
  defaultValues,
  filterKeys,
}: UseAdminTableQueryFormOptions<TValues>): UseAdminTableQueryFormResult<TValues> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const schema = useMemo(() => createStringSchema(defaultValues), [defaultValues]);
  const currentParams = useMemo(() => new URLSearchParams(queryString), [queryString]);
  const page = readPage(currentParams);
  const queryValues = useMemo(
    () => readValuesFromParams(defaultValues, currentParams),
    [currentParams, defaultValues],
  );
  const form = useForm<TValues>({
    resolver: zodResolver(schema) as Resolver<TValues>,
    defaultValues: queryValues as DefaultValues<TValues>,
  });

  useEffect(() => {
    form.reset(queryValues as DefaultValues<TValues>);
  }, [form, queryValues]);

  const writeQuery = useCallback(
    (updates: Record<string, string | number | undefined>, resetPage = true) => {
      const nextParams = new URLSearchParams(queryString);

      Object.entries(updates).forEach(([key, value]) => {
        const normalizedValue =
          typeof value === 'string' ? value.trim() : value === undefined ? '' : String(value);

        if (!normalizedValue || (key === 'page' && normalizedValue === '1')) {
          nextParams.delete(key);
          return;
        }

        nextParams.set(key, normalizedValue);
      });

      if (resetPage) {
        nextParams.delete('page');
      }

      const nextQueryString = nextParams.toString();
      router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, queryString, router],
  );

  const setField = useCallback(
    <TKey extends keyof TValues & string>(key: TKey, value: TValues[TKey]) => {
      form.setValue(key as unknown as Path<TValues>, value as PathValue<TValues, Path<TValues>>, {
        shouldDirty: true,
      });
    },
    [form],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      writeQuery({ page: Math.max(1, nextPage) }, false);
    },
    [writeQuery],
  );

  const applySearch = form.handleSubmit((values) => {
    if (!('search' in values)) {
      return;
    }

    writeQuery({ search: values.search }, true);
  });

  const clearSearch = useCallback(() => {
    if (!('search' in defaultValues)) {
      return;
    }

    setField('search' as keyof TValues & string, '' as TValues[keyof TValues & string]);
    writeQuery({ search: '' }, true);
  }, [defaultValues, setField, writeQuery]);

  const applyFilters = form.handleSubmit((values) => {
    const updates = filterKeys.reduce<Record<string, string>>((nextUpdates, key) => {
      nextUpdates[key] = values[key];
      return nextUpdates;
    }, {});

    writeQuery(updates, true);
  });

  const resetFilters = useCallback(() => {
    const updates = filterKeys.reduce<Record<string, string>>((nextUpdates, key) => {
      const defaultValue = defaultValues[key];

      setField(key, defaultValue);
      nextUpdates[key] = defaultValue;
      return nextUpdates;
    }, {});

    writeQuery(updates, true);
  }, [defaultValues, filterKeys, setField, writeQuery]);

  return {
    form,
    queryValues,
    queryParams: {
      ...queryValues,
      page,
    },
    page,
    activeFilterCount: filterKeys.filter((key) => Boolean(queryValues[key])).length,
    hasSearch: 'search' in queryValues ? Boolean(queryValues.search) : false,
    setField,
    setPage,
    applySearch,
    clearSearch,
    applyFilters,
    resetFilters,
  };
}
