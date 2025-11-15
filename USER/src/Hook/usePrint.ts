
import { useCallback } from 'react';
import type { RefObject } from 'react';

export const usePrint = (ref: RefObject<HTMLDivElement | null>) => {
  const handlePrint = useCallback(() => {
    if (ref.current) {
      window.print();
    }
  }, [ref]);

  return { handlePrint };
};