import { useTRPCContext } from '../components/TRPCProvider';
import { useState, useEffect } from 'react';

export const useGetSocialiteByUserId = (userId: string) => {
  const trpcClient = useTRPCContext();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchSocialite = async () => {
      try {
        setIsLoading(true);
        const result = await trpcClient.socialite.getByUserId(userId);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchSocialite();
    }
  }, [userId, trpcClient]);

  return { data, isLoading, error };
};

export const useCreateSocialite = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (data: any) => {
      return await trpcClient.socialite.create(data);
    },
    isLoading: false,
    error: null,
  };
};

export const useUpdateSocialite = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (data: any) => {
      return await trpcClient.socialite.update(data);
    },
    isLoading: false,
    error: null,
  };
};

export const useDeleteSocialite = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (id: string) => {
      return await trpcClient.socialite.delete(id);
    },
    isLoading: false,
    error: null,
  };
}; 