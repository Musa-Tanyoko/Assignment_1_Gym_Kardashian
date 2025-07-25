import { z } from 'zod';
// Import Firestore utilities (implement these in lib/firestore/pets.ts)
import { getPetById, createPet, updatePet, deletePet } from '../lib/firestore/pets';
import { protectedProcedure, router } from './index';

export const petRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getPetById(input.id);
    }),

  create: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      ownerId: z.string(),
      // add other fields as needed
    }))
    .mutation(async ({ input }) => {
      return await createPet(input);
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      updates: z.record(z.any())
    }))
    .mutation(async ({ input }) => {
      return await updatePet(input.id, input.updates);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deletePet(input.id);
    }),
});
