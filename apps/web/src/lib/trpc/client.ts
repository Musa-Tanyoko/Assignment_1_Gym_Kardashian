import { createTRPCReact } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trpc = createTRPCReact<any>();

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Helper function to get auth token
const getAuthToken = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Get the appropriate API URL based on environment
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use Firebase Functions URL from environment variable
    return import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || '/api/trpc';
  }
  return '/api/trpc';
};

// Create tRPC client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getApiUrl(),
      transformer: superjson,
      headers: async () => {
        const token = await getAuthToken();
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});

// Create authenticated tRPC client (for backward compatibility)
export const createAuthenticatedTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: getApiUrl(),
        transformer: superjson,
        headers: async () => {
          const token = await getAuthToken();
          return token ? { authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}; 