import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useQueryParams<T extends Record<string, string>>() {
  const { search } = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(search);
    const entries = Object.fromEntries(params.entries());
    return entries as Partial<T>;
  }, [search]);
}
