import { trpc } from '../lib/trpc/client';

export const useGetSocialiteByUserId = (userId: string) => {
  const trpcClient = trpc.socialite.getByUserId.useQuery({ userId });
  return trpcClient;
};

export const useCreateSocialite = () => {
  const trpcClient = trpc.socialite.create.useMutation();
  return trpcClient;
};

export const useUpdateSocialite = () => {
  const trpcClient = trpc.socialite.update.useMutation();
  return trpcClient;
};

export const useDeleteSocialite = () => {
  const trpcClient = trpc.socialite.delete.useMutation();
  return trpcClient;
}; 