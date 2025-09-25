import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useIsFetching,
  useIsMutating,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

function ReactQueryProvider({ children }: Props) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // refetchOnWindowFocus: false,
      },
    },
    queryCache: new QueryCache({
      onError: () => {
        // console.log('QueryCache', err);
        // showToastErrors(err);
      },
    }),
    mutationCache: new MutationCache({
      onError: () => {
        // console.log('mutationCache', err);
        // showToastErrors(err);
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
