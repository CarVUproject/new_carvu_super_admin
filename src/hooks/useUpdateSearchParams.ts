import {
  FILTER_PARAMS_PREFIX,
  PAGE_PARAMS_PREFIX,
  SEARCH_PARAMS_PREFIX,
} from '@/constants/paramPrefix';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useUpdateSearchParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Function to update search parameters
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  // Function to reset specific search parameters and state
  const resetSearchParams = useCallback(
    (resetStates?: () => void) => {
      const params = new URLSearchParams(searchParams);

      const keysToDelete: string[] = [];
      params.forEach((_, key) => {
        if (
          key.startsWith(SEARCH_PARAMS_PREFIX) ||
          key.startsWith(FILTER_PARAMS_PREFIX) ||
          key === PAGE_PARAMS_PREFIX
        ) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach((key) => params.delete(key));

      // Reset dependent states if a resetStates callback is provided
      if (resetStates) resetStates();

      if ([...params].length === 0) {
        router.push(window.location.pathname);
      } else {
        router.push(`?${params.toString()}`);
      }
    },
    [router, searchParams],
  );

  // Function to handle search submission
  const submitSearch = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Reset the pagination parameters if there are
      if (params.get(PAGE_PARAMS_PREFIX)) params.delete(PAGE_PARAMS_PREFIX);

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return {
    updateSearchParams,
    resetSearchParams,
    submitSearch,
  };
};
