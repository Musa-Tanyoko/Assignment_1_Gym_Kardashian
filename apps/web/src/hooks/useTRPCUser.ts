import { trpc } from '../lib/trpc/client';

export const useGetUserById = (uid: string) => {
  const trpcClient = trpc.user.getById.useQuery({ uid });
  return trpcClient;
};

export const useCreateUser = () => {
  const trpcClient = trpc.user.create.useMutation();
  return trpcClient;
};

export const useUpdateUser = () => {
  const trpcClient = trpc.user.update.useMutation();
  return trpcClient;
};

export const useDeleteUser = () => {
  const trpcClient = trpc.user.delete.useMutation();
  return trpcClient;
};

export const useGetAllUsers = (limit?: number) => {
  const trpc = useTRPC();
  
  return useQuery({
    queryKey: ['users', limit],
    queryFn: () => trpc.user.getAll({ limit }),
  });
}; 