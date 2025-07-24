import { initTRPC } from '@trpc/server';
import { z } from 'zod';
// Import Firestore utilities (implement these in lib/firestore/users.ts)
import { getUserById, createUser, updateUser, deleteUser } from '../lib/firestore/users';

const t = initTRPC.create();

export const userRouter = t.router({
  getById: t.procedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ input }) => {
      return await getUserById(input.uid);
    }),
  create: t.procedure
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
  update: t.procedure
    .input(z.object({
      uid: z.string(),
      updates: z.record(z.any())
    }))
    .mutation(async ({ input }) => {
      return await updateUser(input.uid, input.updates);
    }),
  delete: t.procedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteUser(input.uid);
    }),
});
