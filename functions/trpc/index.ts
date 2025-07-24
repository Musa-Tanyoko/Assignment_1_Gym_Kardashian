import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { userRouter } from './userRouter';
import { petRouter } from './petRouter';
import { workoutRouter } from './workoutRouter';

// Create tRPC context
export const createContext = async (req: any) => {
  const auth = getAuth();
  const db = getFirestore();
  
  // Get auth token from headers
  const authHeader = req.headers.authorization;
  let user = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decodedToken = await auth.verifyIdToken(token);
      user = decodedToken;
    } catch (error) {
      // Token is invalid, but we don't throw here
      // Let individual procedures handle auth requirements
    }
  }
  
  return {
    auth,
    db,
    user,
    req,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Create base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to check if user is authenticated
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// Root router
export const appRouter = router({
  user: userRouter,
  pet: petRouter,
  workout: workoutRouter,
});

export type AppRouter = typeof appRouter;
