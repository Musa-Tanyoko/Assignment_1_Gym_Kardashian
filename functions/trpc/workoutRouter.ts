
import { z } from 'zod';
import { getWorkoutById, createWorkout, updateWorkout, deleteWorkout } from '../lib/firestore/workouts';
import { getCreditsByUserId } from '../lib/firestore/credits';
import { getUserStats } from '../lib/firestore/stats';
import { protectedProcedure, router } from './index';
import { updateUser } from '../lib/firestore/users';

export const workoutRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getWorkoutById(input.id);
    }),

  getCredits: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await getCreditsByUserId(input.userId);
    }),

  getStats: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await getUserStats(input.userId);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteWorkout(input.id);
    }),

  complete: protectedProcedure
    .input(z.object({
      id: z.string(),
      userId: z.string(),
      earnedCredits: z.number(),
      earnedFame: z.number().optional(),
      earnedExperience: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      // Mark workout as completed
      await updateWorkout(input.id, { completed: true, creditsEarned: input.earnedCredits });
      // Award credits to user
      await updateUser(input.userId, {
        credits: (await getCreditsByUserId(input.userId)).credits + input.earnedCredits
      });
      return { success: true, creditsAwarded: input.earnedCredits };
    }),

  create: protectedProcedure
    .input(z.object({
      userId: z.string(),
      exercises: z.array(z.object({
        name: z.string(),
        sets: z.number(),
        reps: z.union([z.number(), z.string()]),
        duration: z.number(),
        completed: z.boolean().optional(),
      })),
      totalDuration: z.number(),
      difficulty: z.number(),
      creditReward: z.number(),
      fameReward: z.number(),
      experienceReward: z.number(),
      completed: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      // Generate a unique workout ID (timestamp + userId)
      const id = `${input.userId}-${Date.now()}`;
      await createWorkout({
        id,
        userId: input.userId,
        exercises: input.exercises,
        totalDuration: input.totalDuration,
        difficulty: input.difficulty,
        creditsEarned: input.creditReward,
        fameReward: input.fameReward,
        experienceReward: input.experienceReward,
        completed: input.completed ?? false,
        createdAt: new Date().toISOString(),
      });
      return { id };
    }),
});
