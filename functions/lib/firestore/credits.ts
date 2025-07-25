import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function getCreditsByUserId(userId: string) {
  // Example: sum credits from workouts
  const workoutsSnap = await db.collection('workouts').where('userId', '==', userId).get();
  let credits = 0;
  workoutsSnap.forEach(doc => {
    credits += doc.data().creditsEarned || 0;
    credits -= doc.data().creditsSpent || 0;
  });
  return { credits };
}
