import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '../components/TRPCProvider';

export const useSignUp = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (input: {
      email: string;
      password: string;
      userData: {
        name: string;
        age: number;
        weight: number;
        height?: number;
        fitnessGoal: string;
        activityLevel: string;
        bmi?: number;
        credits?: number;
      };
    }) => trpc.auth.signUp(input),
  });
};

export const useSignIn = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (input: { email: string; password: string }) => 
      trpc.auth.signIn(input),
  });
};

export const useSignOut = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: () => trpc.auth.signOut(),
  });
};

export const useCurrentUser = () => {
  const trpc = useTRPC();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => trpc.auth.getCurrentUser(),
    retry: false,
  });
}; 