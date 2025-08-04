import { useTRPCContext } from '../components/TRPCProvider';
import { useState, useEffect } from 'react';

export const useGetWorkoutById = (id: string) => {
  const trpcClient = useTRPCContext();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setIsLoading(true);
        const result = await trpcClient.workout.getById(id);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchWorkout();
    }
  }, [id, trpcClient]);

  return { data, isLoading, error };
};

export const useGetWorkoutsByUserId = (userId: string) => {
  const trpcClient = useTRPCContext();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        // This would need to be implemented in your backend
        // For now, return empty array
        setData([]);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchWorkouts();
    }
  }, [userId, trpcClient]);

  return { data, isLoading, error };
};

export const useCreateWorkout = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (data: any) => {
      return await trpcClient.workout.create(data);
    },
    isLoading: false,
    error: null,
  };
};

export const useUpdateWorkout = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (data: any) => {
      // This would need to be implemented in your backend
      return { success: true };
    },
    isLoading: false,
    error: null,
  };
};

export const useCompleteWorkout = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (data: any) => {
      return await trpcClient.workout.complete(data);
    },
    isLoading: false,
    error: null,
  };
};

export const useDeleteWorkout = () => {
  const trpcClient = useTRPCContext();
  
  return {
    mutateAsync: async (id: string) => {
      return await trpcClient.workout.delete(id);
    },
    isLoading: false,
    error: null,
  };
}; 

export const useGetUserStats = (userId: string) => {
  const trpcClient = useTRPCContext();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const result = await trpcClient.workout.getStats(userId);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId, trpcClient]);

  return { data, isLoading, error };
}; 

export const useGetCalendarData = (userId: string, dateRange: { startDate: Date; endDate: Date }) => {
  const trpcClient = useTRPCContext();
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true);
        // For now, return mock data since we don't have a calendar endpoint
        // In a real implementation, this would call a tRPC endpoint
        const mockData = {};
        setData(mockData);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchCalendarData();
    }
  }, [userId, dateRange, trpcClient]);

  return { data, isLoading, error };
}; 