import { useMutation, useQuery } from '@tanstack/react-query';
import { trpc } from '../lib/trpc/client';

export const useSignUp = () => {
  const trpcClient = trpc.auth.signUp.useMutation();
  return trpcClient;
};

export const useSignIn = () => {
  const trpcClient = trpc.auth.signIn.useMutation();
  return trpcClient;
};

export const useSignOut = () => {
  const trpcClient = trpc.auth.signOut.useMutation();
  return trpcClient;
};

export const useGetCurrentUser = () => {
  const trpcClient = trpc.auth.getCurrentUser.useQuery();
  return trpcClient;
}; 