import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '../firebase';

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Create tRPC context
export const createContext = async () => {
  return {
    auth,
    db,
    user: null as FirebaseUser | null,
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

// User schema for validation
const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().min(13).max(120),
  weight: z.number().min(30).max(300),
  height: z.number().min(100).max(250).optional(),
  fitnessGoal: z.enum(['weight-loss', 'muscle-gain', 'endurance', 'flexibility', 'general-fitness']),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']),
  bmi: z.number().optional(),
  credits: z.number().default(100),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const SocialiteSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['influencer', 'celebrity', 'mogul', 'icon']),
  level: z.number(),
  age: z.number(),
  fame: z.number(),
  experience: z.number(),
  hunger: z.number(),
  hygiene: z.number(),
  happiness: z.number(),
  spa: z.number(),
  glam: z.number(),
  outfits: z.number(),
  photoshoots: z.number(),
  trips: z.number(),
  posts: z.number(),
  wellness: z.number(),
  petcare: z.number(),
  events: z.number(),
  pr: z.number(),
  totalWorkouts: z.number(),
  totalCreditsEarned: z.number(),
  lastWorkoutDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const WorkoutSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.number(),
    reps: z.number().or(z.string()),
    duration: z.number(),
    completed: z.boolean().default(false),
  })),
  totalDuration: z.number(),
  difficulty: z.number(),
  creditReward: z.number(),
  fameReward: z.number(),
  experienceReward: z.number(),
  completed: z.boolean().default(false),
  createdAt: z.date().optional(),
  completedAt: z.date().optional(),
});

// Auth router
export const authRouter = router({
  // Sign up new user
  signUp: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      userData: UserSchema.omit({ uid: true, createdAt: true, updatedAt: true }),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          ctx.auth,
          input.email,
          input.password
        );

        const user = userCredential.user;

        // Create user document in Firestore
        const userDoc = {
          ...input.userData,
          uid: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await setDoc(doc(ctx.db, 'users', user.uid), userDoc);

        return {
          user: {
            uid: user.uid,
            email: user.email,
            ...input.userData,
          },
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Sign in user
  signIn: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          ctx.auth,
          input.email,
          input.password
        );

        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(ctx.db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User data not found',
          });
        }

        return {
          user: {
            uid: user.uid,
            email: user.email,
            ...userDoc.data(),
          },
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Sign out user
  signOut: publicProcedure
    .mutation(async ({ ctx }) => {
      try {
        await signOut(ctx.auth);
        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Get current user
  getCurrentUser: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const userDoc = await getDoc(doc(ctx.db, 'users', ctx.user.uid));
        
        if (!userDoc.exists()) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User data not found',
          });
        }

        return {
          uid: ctx.user.uid,
          email: ctx.user.email,
          ...userDoc.data(),
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
});

// User router
export const userRouter = router({
  // Get user by ID
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const userDoc = await getDoc(doc(ctx.db, 'users', input));
        
        if (!userDoc.exists()) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        return {
          uid: input,
          ...userDoc.data(),
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Update user
  update: protectedProcedure
    .input(z.object({
      uid: z.string(),
      updates: UserSchema.partial().omit({ uid: true }),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userRef = doc(ctx.db, 'users', input.uid);
        
        // Check if user exists
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Update user document
        await updateDoc(userRef, {
          ...input.updates,
          updatedAt: Timestamp.now(),
        });

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Delete user
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        await deleteDoc(doc(ctx.db, 'users', input));
        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Get all users (admin only)
  getAll: protectedProcedure
    .input(z.object({
      limit: z.number().optional(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const usersQuery = query(collection(ctx.db, 'users'));
        const querySnapshot = await getDocs(usersQuery);
        
        const users = querySnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
        }));

        return users.slice(0, input.limit || users.length);
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
});

// Socialite router
export const socialiteRouter = router({
  // Get socialite by user ID
  getByUserId: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const socialiteQuery = query(
          collection(ctx.db, 'socialites'),
          where('userId', '==', input)
        );
        const querySnapshot = await getDocs(socialiteQuery);
        
        if (querySnapshot.empty) {
          return null;
        }

        const socialiteDoc = querySnapshot.docs[0];
        return {
          id: socialiteDoc.id,
          ...socialiteDoc.data(),
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Create socialite
  create: protectedProcedure
    .input(SocialiteSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
      userId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const socialiteData = {
          ...input,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const socialiteRef = doc(collection(ctx.db, 'socialites'));
        await setDoc(socialiteRef, socialiteData);

        return {
          id: socialiteRef.id,
          ...socialiteData,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Update socialite
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      updates: SocialiteSchema.partial().omit({ id: true, createdAt: true }),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const socialiteRef = doc(ctx.db, 'socialites', input.id);
        
        await updateDoc(socialiteRef, {
          ...input.updates,
          updatedAt: Timestamp.now(),
        });

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Delete socialite
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        await deleteDoc(doc(ctx.db, 'socialites', input));
        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
});

// Workout router
export const workoutRouter = router({
  // Get workouts by user ID
  getByUserId: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const workoutQuery = query(
          collection(ctx.db, 'workouts'),
          where('userId', '==', input)
        );
        const querySnapshot = await getDocs(workoutQuery);
        
        const workouts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        return workouts.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Create workout
  create: protectedProcedure
    .input(WorkoutSchema.omit({ id: true, createdAt: true, completedAt: true }))
    .mutation(async ({ input, ctx }) => {
      try {
        const workoutData = {
          ...input,
          createdAt: Timestamp.now(),
        };

        const workoutRef = doc(collection(ctx.db, 'workouts'));
        await setDoc(workoutRef, workoutData);

        return {
          id: workoutRef.id,
          ...workoutData,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Update workout
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      updates: WorkoutSchema.partial().omit({ id: true, createdAt: true }),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const workoutRef = doc(ctx.db, 'workouts', input.id);
        
        const updateData = { ...input.updates };
        if (input.updates.completed) {
          updateData.completedAt = Timestamp.now();
        }

        await updateDoc(workoutRef, updateData);

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Complete workout
  complete: protectedProcedure
    .input(z.object({
      id: z.string(),
      earnedCredits: z.number(),
      earnedFame: z.number(),
      earnedExperience: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const workoutRef = doc(ctx.db, 'workouts', input.id);
        
        // Update workout as completed
        await updateDoc(workoutRef, {
          completed: true,
          completedAt: Timestamp.now(),
        });

        // Update user credits
        const userRef = doc(ctx.db, 'users', ctx.user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const currentCredits = userDoc.data().credits || 0;
          await updateDoc(userRef, {
            credits: currentCredits + input.earnedCredits,
            updatedAt: Timestamp.now(),
          });
        }

        // Update socialite fame and experience
        const socialiteQuery = query(
          collection(ctx.db, 'socialites'),
          where('userId', '==', ctx.user.uid)
        );
        const socialiteSnapshot = await getDocs(socialiteQuery);
        
        if (!socialiteSnapshot.empty) {
          const socialiteRef = socialiteSnapshot.docs[0].ref;
          const socialiteData = socialiteSnapshot.docs[0].data();
          
          await updateDoc(socialiteRef, {
            fame: socialiteData.fame + input.earnedFame,
            experience: socialiteData.experience + input.earnedExperience,
            totalWorkouts: socialiteData.totalWorkouts + 1,
            totalCreditsEarned: socialiteData.totalCreditsEarned + input.earnedCredits,
            lastWorkoutDate: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  // Delete workout
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        await deleteDoc(doc(ctx.db, 'workouts', input));
        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
});

// Root router
export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  socialite: socialiteRouter,
  workout: workoutRouter,
});

export type AppRouter = typeof appRouter; 