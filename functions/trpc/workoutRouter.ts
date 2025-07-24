import { initTRPC } from '@trpc/server';
import { z } from 'zod';
// Import Firestore utilities (implement these in lib/firestore/workouts.ts)
import { getWorkoutById, createWorkout, updateWorkout, deleteWorkout } from '../lib/firestore/workouts';

const t = initTRPC.create();

export const workoutRouter = t.router({
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getWorkoutById(input.id);
    }),
  create: t.procedure
    .input(z.object({
      id: z.string(),
      userId: z.string(),
      type: z.string(),
      duration: z.number(),
      // add other fields as needed
    }))
    .mutation(async ({ input }) => {
      return await createWorkout(input);
    }),
  update: t.procedure
    .input(z.object({
      id: z.string(),
      updates: z.record(z.any())
    }))
    .mutation(async ({ input }) => {
      return await updateWorkout(input.id, input.updates);
    }),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteWorkout(input.id);
    }),
});
