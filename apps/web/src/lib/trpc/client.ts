/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryClient } from '@tanstack/react-query';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { saveUser, getUser, updateUserProfile, saveSocialite, getSocialite, saveActivityLog } from '../firebase-client';

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Custom API client that connects to your backend
class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAuthHeaders() {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> || {}),
      } as HeadersInit,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // User endpoints
  user = {
    getById: async (uid: string) => getUser(uid),
    create: async (data: any) => {
      const user = await getUser(data.uid);
      return user;
    },
    update: async (data: any) => {
      await updateUserProfile(data.uid, data);
      return getUser(data.uid);
    },
    delete: async (uid: string) => {
      // Implement deletion logic using firebase-client
      throw new Error('Delete user not implemented');
    },
    updateProfile: async (data: any) => {
      await updateUserProfile(data.uid, data);
      return { success: true };
    },
    setFitnessGoal: async (data: any) => {
      console.log('tRPC setFitnessGoal called with:', data);
      try {
        await updateUserProfile(data.uid, { fitnessGoal: data.fitnessGoal });
        console.log('Fitness goal updated successfully');
        return { success: true };
      } catch (error) {
        console.error('Error in setFitnessGoal:', error);
        throw error;
      }
    },
    getAchievements: async (uid: string) => {
      return this.request(`/user.getAchievements?input=${encodeURIComponent(JSON.stringify({ uid }))}`);
    },
  };

  // Workout endpoints
  workout = {
    getById: async (id: string) => {
      return this.request(`/workout.getById?input=${encodeURIComponent(JSON.stringify({ id }))}`);
    },
    getCredits: async (userId: string) => {
      const user = await getUser(userId);
      return { credits: user.credits };
    },
    getStats: async (userId: string) => {
      const user = await getUser(userId);
      return {
        totalWorkouts: user.totalWorkouts,
        fame: user.fame,
        experience: user.experience
      };
    },
    create: async (data: any) => {
      const user = await getUser(data.userId);
      const workout = {
        ...data,
        userId: user.uid,
        timestamp: new Date()
      };
      await saveActivityLog(user.uid, {
        id: Date.now().toString(),
        type: 'workout',
        title: 'Progressive Workout',
        time: 'Just now',
        duration: `${data.totalDuration} min`,
        calories: 100,
        timestamp: new Date(),
        metadata: { exercises: data.exercises.map((ex: any) => ex.name) }
      });
      return workout;
    },
    complete: async (data: any) => {
      console.log('Workout complete called with data:', data);
      console.log('Workout complete - earnedCredits:', data.earnedCredits);
      console.log('Workout complete - earnedFame:', data.earnedFame);
      console.log('Workout complete - earnedExperience:', data.earnedExperience);
      
      try {
        const user = await getUser(data.userId);
        console.log('Starting workout completion for user:', data.userId, 'Current credits:', user?.credits, 'Earned credits:', data.earnedCredits);
        
        if (!user) {
          console.warn('User not found, creating new user');
          const { initialUser } = await import('../../types/user');
          const newUser = initialUser(data.userId, 'New User', 'default@example.com');
          await saveUser(newUser);
          console.log('New user created:', newUser);
        }
        
        const earnedCredits = data.earnedCredits || 0;
        const earnedFame = data.earnedFame || 0;
        const earnedExperience = data.earnedExperience || 0;
        
        console.log('Credits to award:', earnedCredits, 'Fame:', earnedFame, 'Experience:', earnedExperience);

        const updatedCredits = (user?.credits || 0) + earnedCredits;
        const updatedTotalWorkouts = (user?.totalWorkouts || 0) + 1;
        const updatedFame = (user?.fame || 0) + earnedFame;
        const updatedExperience = (user?.experience || 0) + earnedExperience;
        
        console.log('Updated values - Credits:', updatedCredits, 'Total Workouts:', updatedTotalWorkouts);

        const updateData = {
          credits: updatedCredits,
          totalWorkouts: updatedTotalWorkouts,
          fame: updatedFame,
          experience: updatedExperience,
          lastUpdated: new Date()
        };
        
        console.log('Updating user profile with data:', updateData);
        await updateUserProfile(data.userId, updateData);

        console.log('User profile updated successfully');

        // Save activity log with error handling
        try {
          await saveActivityLog(data.userId, {
            id: Date.now().toString(),
            type: 'workout',
            title: 'Workout Completed',
            time: 'Just now',
            duration: `${data.totalDuration || 0} min`,
            calories: 100,
            timestamp: new Date(),
            metadata: { exercises: data.exercises?.map((ex: any) => ex.name) || [] }
          });
          console.log('Activity log saved successfully');
        } catch (activityError) {
          const errorMessage = activityError instanceof Error ? activityError.message : 'Unknown error';
          console.warn('Failed to save activity log:', errorMessage);
          // Don't fail the entire operation for activity log failure
        }

        // Update socialite data with error handling
        try {
          const socialite = await getSocialite(data.userId, 1);
          await saveSocialite(data.userId, {
            ...socialite,
            totalCreditsEarned: (socialite.totalCreditsEarned || 0) + earnedCredits,
            totalWorkouts: (socialite.totalWorkouts || 0) + 1,
            updatedAt: new Date()
          });
          console.log('Socialite data updated successfully');
        } catch (socialiteError) {
          const errorMessage = socialiteError instanceof Error ? socialiteError.message : 'Unknown error';
          console.warn('Failed to update socialite data:', errorMessage);
          // Don't fail the entire operation for socialite update failure
        }

        // Get the updated user to return the correct credits
        const updatedUser = await getUser(data.userId);
        console.log('Workout completed successfully, new credits:', updatedUser.credits);

        return { success: true, credits: updatedUser.credits };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : 'No stack trace';
        console.error('Workout completion failed:', errorMessage, 'Stack:', errorStack);
        console.error('Error details:', {
          userId: data.userId,
          earnedCredits: data.earnedCredits,
          earnedFame: data.earnedFame,
          earnedExperience: data.earnedExperience,
          totalDuration: data.totalDuration,
          exercisesCount: data.exercises?.length || 0
        });
        throw error; // Re-throw for upstream handling
      }
    },
    delete: async (id: string) => {
      return this.request('/workout.delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
    },
  };

  // Socialite endpoints
  socialite = {
    getByUserId: async (userId: string) => {
      const socialite = await getSocialite(userId, 1);
      return socialite;
    },
    create: async (data: any) => {
      const socialite = await getSocialite(data.userId, 1);
      return socialite;
    },
    update: async (data: any) => {
      const socialite = await getSocialite(data.userId, data.id);
      const updatedSocialite = { ...socialite, ...data.updates, updatedAt: new Date() };
      await saveSocialite(data.userId, updatedSocialite);
      return updatedSocialite;
    },
    delete: async (id: string) => {
      // Implement deletion logic
    },
  };

  // Pet endpoints
  pet = {
    getById: async (id: string) => {
      return this.request(`/pet.getById?input=${encodeURIComponent(JSON.stringify({ id }))}`);
    },
    create: async (data: any) => {
      return this.request('/pet.create', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (data: any) => {
      return this.request('/pet.update', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return this.request('/pet.delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
    },
  };
}

// Create the API client instance
export const apiClient = new APIClient('http://localhost:5175/api/trpc');

// Export trpcClient for compatibility with existing code
export const trpcClient = apiClient;