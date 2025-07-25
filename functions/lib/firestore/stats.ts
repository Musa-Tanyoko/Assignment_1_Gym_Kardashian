import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function getUserStats(userId: string) {
  // Example: aggregate stats from workouts collection
  const workoutsSnap = await db.collection('workouts').where('userId', '==', userId).get();
  let steps = 0, exercisesCompleted = 0, streak = 0, sessions = 0, hours = 0;
  workoutsSnap.forEach(doc => {
    const data = doc.data();
    steps += data.steps || 0;
    exercisesCompleted += data.exercisesCompleted || 0;
    sessions += 1;
    hours += data.duration ? data.duration / 60 : 0;
  });
  // TODO: Calculate streak based on workout dates
  return { steps, exercisesCompleted, streak, sessions, hours };
}
