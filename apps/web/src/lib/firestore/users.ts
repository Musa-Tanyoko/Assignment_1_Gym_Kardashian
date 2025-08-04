export interface User {
    uid: string;
    name: string;
    email: string;
    age?: number;
    height?: number;
    weight?: number;
    fitnessGoal?: string;
    activityLevel?: string;
    bmi?: number;
    credits: number;
    workoutsPerWeek?: number;
    totalWorkouts: number;
    fame: number;
    experience: number;
    lastWorkoutDate?: Date;
  }
  
  export const initialUser = (uid: string, name: string, email: string): User => ({
    uid,
    name,
    email,
    age: 25,
    weight: 70,
    height: 170,
    fitnessGoal: 'general-fitness',
    activityLevel: 'moderately_active',
    credits: 0,
    workoutsPerWeek: 3,
    totalWorkouts: 0,
    fame: 0,
    experience: 0,
  });