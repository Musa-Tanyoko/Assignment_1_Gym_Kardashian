// Firestore utility functions for users
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function getUserById(uid: string) {
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

export async function createUser(userData: any) {
  await db.collection('users').doc(userData.uid).set(userData);
  return userData;
}

export async function updateUser(uid: string, updates: any) {
  await db.collection('users').doc(uid).update(updates);
  return updates;
}

export async function deleteUser(uid: string) {
  await db.collection('users').doc(uid).delete();
  return { success: true };
}
