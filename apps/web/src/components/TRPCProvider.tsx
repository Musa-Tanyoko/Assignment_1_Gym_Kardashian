import React, { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMockTRPCClient } from '../lib/trpc/mock-client';

// Create context for the mock client
const TRPCContext = createContext<any>(null);

export const useTRPC = () => {
  const context = useContext(TRPCContext);
  if (!context) {
    throw new Error('useTRPC must be used within a TRPCProvider');
  }
  return context;
};

interface TRPCProviderProps {
  children: ReactNode;
}

export const TRPCProvider: React.FC<TRPCProviderProps> = ({ children }) => {
  const { mockClient, queryClient } = createMockTRPCClient();

  return (
    <TRPCContext.Provider value={mockClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </TRPCContext.Provider>
  );
}; 