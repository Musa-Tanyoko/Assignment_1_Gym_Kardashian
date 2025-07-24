import { createTRPCReact } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from './server';

export const trpc = createTRPCReact<AppRouter>();

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Create tRPC client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
    }),
  ],
});

// Helper function to get auth token
const getAuthToken = async () => {
  // In a real app, you'd get this from your auth context
  // For now, we'll return null and handle auth on the server side
  return null;
};

// Create authenticated tRPC client
export const createAuthenticatedTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        transformer: superjson,
        headers: async () => {
          const token = await getAuthToken();
          return token ? { authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}; 