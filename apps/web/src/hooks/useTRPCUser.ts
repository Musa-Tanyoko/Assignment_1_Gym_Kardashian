import { useTRPCContext } from '../components/TRPCProvider';
import { useState, useEffect } from 'react';

export const useGetUserById = (uid: string) => {
  const trpcClient = useTRPCContext();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const result = await trpcClient.user.getById(uid);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) {
      fetchUser();
    }
  }, [uid, trpcClient]);

  return { data, isLoading, error };
};

export const useCreateUser = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (data: any) => {
      return await trpcClient.user.create(data);
    },
    isLoading: false,
    error: null,
  };
};

export const useUpdateUser = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (data: any) => {
      return await trpcClient.user.update(data);
    },
    isLoading: false,
    error: null,
  };
};

export const useDeleteUser = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (uid: string) => {
      return await trpcClient.user.delete(uid);
    },
    isLoading: false,
    error: null,
  };
};

export const useGetAllUsers = () => {
  // This would need to be implemented in your backend
  return {
    data: [],
    isLoading: false,
    error: null,
  };
}; 