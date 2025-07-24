import { createTRPCReact } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
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
import { app, auth, db } from '../firebase';
import { z } from 'zod';

// Create a mock tRPC client that uses Firebase directly
export const createMockTRPCClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  });

  // Mock tRPC client with Firebase operations
  const mockClient = {
    auth: {
      signUp: async (input: {
        email: string;
        password: string;
        userData: any;
      }) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            input.email,
            input.password
          );

          const user = userCredential.user;

          const userDoc = {
            ...input.userData,
            uid: user.uid,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          await setDoc(doc(db, 'users', user.uid), userDoc);

          return {
            user: {
              uid: user.uid,
              email: user.email,
              ...input.userData,
            },
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      signIn: async (input: { email: string; password: string }) => {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            input.email,
            input.password
          );

          const user = userCredential.user;
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (!userDoc.exists()) {
            throw new Error('User data not found');
          }

          return {
            user: {
              uid: user.uid,
              email: user.email,
              ...userDoc.data(),
            },
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      signOut: async () => {
        try {
          await signOut(auth);
          return { success: true };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      getCurrentUser: async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            throw new Error('No authenticated user');
          }

          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (!userDoc.exists()) {
            throw new Error('User data not found');
          }

          return {
            uid: user.uid,
            email: user.email,
            ...userDoc.data(),
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    },

    user: {
      getById: async (uid: string) => {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));

          if (!userDoc.exists()) {
            throw new Error('User not found');
          }

          return {
            uid,
            ...userDoc.data(),
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      update: async (input: { uid: string; updates: any }) => {
        try {
          const userRef = doc(db, 'users', input.uid);

          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            throw new Error('User not found');
          }

          await updateDoc(userRef, {
            ...input.updates,
            updatedAt: Timestamp.now(),
          });

          return { success: true };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      delete: async (uid: string) => {
        try {
          await deleteDoc(doc(db, 'users', uid));
          return { success: true };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      getAll: async (input: { limit?: number } = {}) => {
        try {
          const usersQuery = query(collection(db, 'users'));
          const querySnapshot = await getDocs(usersQuery);

          const users = querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data(),
          }));

          return users.slice(0, input.limit || users.length);
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    },

    socialite: {
      getByUserId: async (userId: string) => {
        try {
          const socialiteQuery = query(
            collection(db, 'socialites'),
            where('userId', '==', userId)
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
          throw new Error(error.message);
        }
      },

      create: async (input: any) => {
        try {
          const socialiteData = {
            ...input,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          const socialiteRef = doc(collection(db, 'socialites'));
          await setDoc(socialiteRef, socialiteData);

          return {
            id: socialiteRef.id,
            ...socialiteData,
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      update: async (input: { id: string; updates: any }) => {
        try {
          const socialiteRef = doc(db, 'socialites', input.id);

          await updateDoc(socialiteRef, {
            ...input.updates,
            updatedAt: Timestamp.now(),
          });

          return { success: true };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      delete: async (id: string) => {
        try {
          await deleteDoc(doc(db, 'socialites', id));
          return { success: true };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    },

    workout: {
      getByUserId: async (userId: string) => {
        try {
          const workoutQuery = query(
            collection(db, 'workouts'),
            where('userId', '==', userId)
          );
          const querySnapshot = await getDocs(workoutQuery);

          const workouts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          return workouts.sort((a, b) => {
            const dateA = (a.createdAt && typeof a.createdAt.toDate === 'function')
              ? a.createdAt.toDate()
              : (typeof a.createdAt === 'string' || typeof a.createdAt === 'number')
                ? new Date(a.createdAt)
                : new Date(0);
            const dateB = (b.createdAt && typeof b.createdAt.toDate === 'function')
              ? b.createdAt.toDate()
              : (typeof b.createdAt === 'string' || typeof b.createdAt === 'number')
                ? new Date(b.createdAt)
                : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      create: async (input: any) => {
        try {
          const workoutData = {
            ...input,
            createdAt: Timestamp.now(),
          };

          const workoutRef = doc(collection(db, 'workouts'));
          await setDoc(workoutRef, workoutData);

          return {
            id: workoutRef.id,
            ...workoutData,
          } as any;
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      update: async (input: { id: string; updates: any }) => {
        try {
          const workoutRef = doc(db, 'workouts', input.id);

          const updateData = { ...input.updates };
          if (input.updates.completed) {
            updateData.completedAt = Timestamp.now();
          }

          await updateDoc(workoutRef, updateData);

          return { success: true };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      complete: async (input: {
        id: string;
        earnedCredits: number;
        earnedFame: number;
        earnedExperience: number;
      }) => {
        try {
          const workoutRef = doc(db, 'workouts', input.id);

          // Update workout as completed
          await updateDoc(workoutRef, {
            completed: true,
            completedAt: Timestamp.now(),
          });

          // Declare user once at the beginning of the function if needed by multiple blocks
          const user = auth.currentUser;

          // Update user credits
          if (user) {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const currentCredits = userDoc.data().credits || 0;
              await updateDoc(userRef, {
                credits: currentCredits + input.earnedCredits,
                updatedAt: Timestamp.now(),
              });
            }
          }

          // Update socialite fame and experience
          // The 'user' variable from above is now used here
          if (user) {
            const socialiteQuery = query(
              collection(db, 'socialites'),
              where('userId', '==', user.uid)
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
          }

          return { success: true };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },

      delete: async (id: string) => {
        try {
          await deleteDoc(doc(db, 'workouts', id));
          return { success: true };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    },
  };

  return { mockClient, queryClient };
};