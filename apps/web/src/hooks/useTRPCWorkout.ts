import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '../components/TRPCProvider';

export const useGetWorkouts = (userId: string) => {
  const trpc = useTRPC();
  
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: () => trpc.workout.getByUserId(userId),
    enabled: !!userId,
  });
};

export const useCreateWorkout = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (input: {
      userId: string;
      exercises: Array<{
        name: string;
        sets: number;
        reps: number | string;
        duration: number;
        completed?: boolean;
      }>;
      totalDuration: number;
      difficulty: number;
      creditReward: number;
      fameReward: number;
      experienceReward: number;
      completed?: boolean;
    }) => trpc.workout.create(input),
  });
};

export const useUpdateWorkout = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (input: { id: string; updates: any }) => 
      trpc.workout.update(input),
  });
};

export const useCompleteWorkout = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (input: {
      id: string;
      earnedCredits: number;
      earnedFame: number;
      earnedExperience: number;
    }) => trpc.workout.complete(input),
  });
};

export const useDeleteWorkout = () => {
  const trpc = useTRPC();
  
  return useMutation({
    mutationFn: (id: string) => trpc.workout.delete(id),
  });
}; 