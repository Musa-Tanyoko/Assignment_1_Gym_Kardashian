import { db } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { User, initialUser } from '../types/user';
import { SocialiteStats, initialSocialite } from '../types/socialite';
import { ActivityLog } from '../hooks/useActivityLogs';

export const saveUser = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    ...user,
    lastUpdated: serverTimestamp()
  }, { merge: true });
};

export const getUser = async (uid: string): Promise<User> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  const newUser = initialUser(uid, 'New User', 'user@example.com');
  await saveUser(newUser);
  return newUser;
};

export const updateUserProfile = async (uid: string, updates: Partial<User>) => {
  console.log('updateUserProfile called with:', { uid, updates });
  const userRef = doc(db, 'users', uid);
  try {
    await updateDoc(userRef, {
      ...updates,
      lastUpdated: serverTimestamp()
    });
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const saveSocialite = async (userId: string, socialite: SocialiteStats) => {
  const socialiteRef = doc(db, 'socialites', `${userId}_${socialite.id}`);
  await setDoc(socialiteRef, {
    ...socialite,
    userId,
    lastUpdated: serverTimestamp()
  }, { merge: true });
};

export const getSocialite = async (userId: string, socialiteId: number): Promise<SocialiteStats> => {
  const socialiteRef = doc(db, 'socialites', `${userId}_${socialiteId}`);
  const socialiteSnap = await getDoc(socialiteRef);
  if (socialiteSnap.exists()) {
    return socialiteSnap.data() as SocialiteStats;
  }
  const newSocialite = initialSocialite(userId);
  await saveSocialite(userId, newSocialite);
  return newSocialite;
};

export const saveActivityLog = async (userId: string, log: ActivityLog) => {
  const logsRef = collection(db, 'users', userId, 'activityLogs');
  await setDoc(doc(logsRef), {
    ...log,
    timestamp: serverTimestamp()
  });
};

export const getActivityLogs = async (userId: string): Promise<ActivityLog[]> => {
  const logsRef = collection(db, 'users', userId, 'activityLogs');
  // Note: This is a simplified version; implement real-time listener or pagination as needed
  // For now, assume a mock fetch; replace with actual query
  return [];
};