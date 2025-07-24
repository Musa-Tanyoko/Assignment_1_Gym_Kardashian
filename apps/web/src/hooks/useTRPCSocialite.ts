import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '../components/TRPCProvider';
import { SocialiteStats } from '../types/socialite';

export const useGetSocialite = (userId: string) => {
  const trpc = useTRPC();
  
  return useQuery({
    queryKey: ['socialite', userId],
    queryFn: () => trpc.socialite.getByUserId(userId),
    enabled: !!userId,
  });
};

export const useCreateSocialite = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (input: Omit<SocialiteStats, 'id' | 'createdAt' | 'updatedAt'> & { userId: string }) => 
      trpc.socialite.create(input),
  });
};

export const useUpdateSocialite = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (input: { id: string; updates: Partial<SocialiteStats> }) => 
      trpc.socialite.update(input),
  });
};

export const useDeleteSocialite = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (id: string) => trpc.socialite.delete(id),
  });
}; 