// Firestore utility functions for workouts
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function getWorkoutById(id: string) {
  const doc = await db.collection('workouts').doc(id).get();
  return doc.exists ? doc.data() : null;
}

export async function createWorkout(workoutData: any) {
  await db.collection('workouts').doc(workoutData.id).set(workoutData);
  return workoutData;
}

export async function updateWorkout(id: string, updates: any) {
  await db.collection('workouts').doc(id).update(updates);
  return updates;
}

export async function deleteWorkout(id: string) {
  await db.collection('workouts').doc(id).delete();
  return { success: true };
}
