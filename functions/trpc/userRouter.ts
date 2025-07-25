
import { z } from 'zod';
import { getUserById, createUser, updateUser, deleteUser } from '../lib/firestore/users';
import { saveActivityLogs } from '../lib/firestore/logs';
import { protectedProcedure, router } from './index';
import { getUserAchievements, checkAndAwardAchievements } from '../lib/firestore/achievements';

export const userRouter = router({
  getById: protectedProcedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ input }) => {
      return await getUserById(input.uid);
    }),

  create: protectedProcedure
    .input(z.object({
      uid: z.string(),
      email: z.string().email(),
      age: z.number().min(13).max(120),
      weight: z.number().min(30).max(300),
      fitnessGoal: z.string(),
      // add other fields as needed
    }))
    .mutation(async ({ input }) => {
      return await createUser(input);
    }),

  update: protectedProcedure
    .input(z.object({
      uid: z.string(),
      updates: z.record(z.string(), z.any())
    }))
    .mutation(async ({ input }) => {
      return await updateUser(input.uid, input.updates);
    }),

  delete: protectedProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteUser(input.uid);
    }),

  // Editable profile endpoints
  updateProfile: protectedProcedure
    .input(z.object({
      uid: z.string(),
      age: z.number().optional(),
      height: z.number().optional(),
      weight: z.number().optional(),
      bodyGoal: z.string().optional(),
      socialiteName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Update user profile and/or socialite name
      return await updateUser(input.uid, input);
    }),

  // Fitness goal endpoint
  setFitnessGoal: protectedProcedure
    .input(z.object({
      uid: z.string(),
      fitnessGoal: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Set fitness goal for user
      return await updateUser(input.uid, { fitnessGoal: input.fitnessGoal });
    }),

  // Activity logs import endpoint (placeholder)
  importActivityLogs: protectedProcedure
    .input(z.object({
      uid: z.string(),
      logs: z.array(z.any()), // Replace with proper log schema
    }))
    .mutation(async ({ input }) => {
      // Save activity logs to user profile or a separate collection
      return await saveActivityLogs(input.uid, input.logs);
    }),

  // Achievements endpoints
  getAchievements: protectedProcedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ input }) => {
      return await getUserAchievements(input.uid);
    }),

  checkAchievements: protectedProcedure
    .input(z.object({ 
      uid: z.string(), 
      stats: z.object({ 
        streak: z.number(), 
        credits: z.number(), 
        workouts: z.number() 
      }) 
    }))
    .mutation(async ({ input }) => {
      return await checkAndAwardAchievements(input.uid, input.stats);
    }),
});