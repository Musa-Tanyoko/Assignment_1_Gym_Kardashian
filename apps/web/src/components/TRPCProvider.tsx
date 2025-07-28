import React, { ReactNode, createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpcClient } from '../lib/trpc/client';

// Create a context for the mock tRPC client
const TRPCContext = createContext(trpcClient);

// Create a fresh query client for the app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

interface TRPCProviderProps {
  children: ReactNode;
}

export const TRPCProvider: React.FC<TRPCProviderProps> = ({ children }) => {
  return (
    <TRPCContext.Provider value={trpcClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </TRPCContext.Provider>
  );
};

// Export the context for use in hooks
export const useTRPCContext = () => useContext(TRPCContext); 