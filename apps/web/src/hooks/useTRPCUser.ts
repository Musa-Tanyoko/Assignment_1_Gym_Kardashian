import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '../components/TRPCProvider';

export const useGetUser = (uid: string) => {
  const trpc = useTRPC();
  
  return useQuery({
    queryKey: ['user', uid],
    queryFn: () => trpc.user.getById(uid),
    enabled: !!uid,
  });
};

export const useUpdateUser = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (input: { uid: string; updates: any }) => 
      trpc.user.update(input),
  });
};

export const useDeleteUser = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (uid: string) => trpc.user.delete(uid),
  });
};

export const useGetAllUsers = (limit?: number) => {
  const trpc = useTRPC();
  
  return useQuery({
    queryKey: ['users', limit],
    queryFn: () => trpc.user.getAll({ limit }),
  });
}; 