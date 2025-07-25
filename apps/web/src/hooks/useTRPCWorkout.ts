import { trpc } from '../lib/trpc/client';

export const useGetWorkoutById = (id: string) => {
  const trpcClient = trpc.workout.getById.useQuery({ id });
  return trpcClient;
};

export const useGetWorkoutsByUserId = (userId: string) => {
  const trpcClient = trpc.workout.getByUserId.useQuery({ userId });
  return trpcClient;
};

export const useCreateWorkout = () => {
  const trpcClient = trpc.workout.create.useMutation();
  return trpcClient;
};

export const useUpdateWorkout = () => {
  const trpcClient = trpc.workout.update.useMutation();
  return trpcClient;
};

export const useCompleteWorkout = () => {
  const trpcClient = trpc.workout.complete.useMutation();
  return trpcClient;
};

export const useDeleteWorkout = () => {
  const trpcClient = trpc.workout.delete.useMutation();
  return trpcClient;
}; 