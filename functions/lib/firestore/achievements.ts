import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateEarned: Date;
};

// Example achievements
export const ACHIEVEMENTS = [
  { id: 'streak-3', name: '3-Day Streak', description: 'Complete 3 days in a row!', icon: '🔥' },
  { id: 'streak-7', name: '7-Day Streak', description: 'Complete 7 days in a row!', icon: '🏅' },
  { id: 'credits-100', name: '100 Credits', description: 'Earn 100 credits!', icon: '💰' },
  { id: 'workouts-10', name: '10 Workouts', description: 'Complete 10 workouts!', icon: '💪' },
];

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const snap = await db.collection('users').doc(userId).collection('achievements').get();
  return snap.docs.map(doc => doc.data() as Achievement);
}

export async function awardAchievement(userId: string, achievement: Achievement) {
  const ref = db.collection('users').doc(userId).collection('achievements').doc(achievement.id);
  await ref.set({ ...achievement, dateEarned: new Date() });
}

// Example logic to check and award achievements
export async function checkAndAwardAchievements(userId: string, stats: { streak: number; credits: number; workouts: number; }) {
  const earned: Achievement[] = [];
  if (stats.streak >= 3) earned.push({ ...ACHIEVEMENTS[0], dateEarned: new Date() });
  if (stats.streak >= 7) earned.push({ ...ACHIEVEMENTS[1], dateEarned: new Date() });
  if (stats.credits >= 100) earned.push({ ...ACHIEVEMENTS[2], dateEarned: new Date() });
  if (stats.workouts >= 10) earned.push({ ...ACHIEVEMENTS[3], dateEarned: new Date() });
  for (const ach of earned) {
    await awardAchievement(userId, ach);
  }
  return earned;
}
