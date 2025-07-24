// Firestore utility functions for pets
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function getPetById(id: string) {
  const doc = await db.collection('pets').doc(id).get();
  return doc.exists ? doc.data() : null;
}

export async function createPet(petData: any) {
  await db.collection('pets').doc(petData.id).set(petData);
  return petData;
}

export async function updatePet(id: string, updates: any) {
  await db.collection('pets').doc(id).update(updates);
  return updates;
}

export async function deletePet(id: string) {
  await db.collection('pets').doc(id).delete();
  return { success: true };
}
