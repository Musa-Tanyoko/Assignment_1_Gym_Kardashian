import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function saveActivityLogs(userId: string, logs: any[]) {
  const batch = db.batch();
  logs.forEach(log => {
    const ref = db.collection('users').doc(userId).collection('activityLogs').doc();
    batch.set(ref, log);
  });
  await batch.commit();
  return { success: true };
}
