/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryClient } from '@tanstack/react-query';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';

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
    getById: async (uid: string) => {
      return this.request(`/user.getById?input=${encodeURIComponent(JSON.stringify({ uid }))}`);
    },
    create: async (data: any) => {
      return this.request('/user.create', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (data: any) => {
      return this.request('/user.update', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    delete: async (uid: string) => {
      return this.request('/user.delete', {
        method: 'POST',
        body: JSON.stringify({ uid }),
      });
    },
    updateProfile: async (data: any) => {
      return this.request('/user.updateProfile', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    setFitnessGoal: async (data: any) => {
      return this.request('/user.setFitnessGoal', {
        method: 'POST',
        body: JSON.stringify(data),
      });
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
      return this.request(`/workout.getCredits?input=${encodeURIComponent(JSON.stringify({ userId }))}`);
    },
    getStats: async (userId: string) => {
      return this.request(`/workout.getStats?input=${encodeURIComponent(JSON.stringify({ userId }))}`);
    },
    create: async (data: any) => {
      return this.request('/workout.create', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    complete: async (data: any) => {
      return this.request('/workout.complete', {
        method: 'POST',
        body: JSON.stringify(data),
      });
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
      return this.request(`/socialite.getByUserId?input=${encodeURIComponent(JSON.stringify({ userId }))}`);
    },
    create: async (data: any) => {
      return this.request('/socialite.create', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (data: any) => {
      return this.request('/socialite.update', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return this.request('/socialite.delete', {
        method: 'POST',
        body: JSON.stringify(id),
      });
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