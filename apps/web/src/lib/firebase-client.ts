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
  const logDoc = doc(logsRef, log.id); // Use the provided log.id as document ID
  const logData = {
    ...log,
    timestamp: new Date() // Use regular Date instead of serverTimestamp for better querying
  };
  await setDoc(logDoc, logData);
};

export const getActivityLogs = async (userId: string): Promise<ActivityLog[]> => {
  console.log('getActivityLogs - Fetching logs for userId:', userId);
  const logsRef = collection(db, 'users', userId, 'activityLogs');
  try {
    const { getDocs } = await import('firebase/firestore');
    
    // Get all documents without ordering first
    const querySnapshot = await getDocs(logsRef);
    console.log('getActivityLogs - Query snapshot size:', querySnapshot.size);
    const logs: ActivityLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Handle different timestamp formats
      let timestamp: Date;
      if (data.timestamp) {
        if (typeof data.timestamp.toDate === 'function') {
          timestamp = data.timestamp.toDate();
        } else if (data.timestamp instanceof Date) {
          timestamp = data.timestamp;
        } else {
          timestamp = new Date(data.timestamp);
        }
      } else {
        timestamp = new Date();
      }
      
      logs.push({
        id: doc.id,
        type: data.type || 'workout',
        title: data.title || 'Workout',
        time: data.time || 'Just now',
        duration: data.duration || '0 min',
        calories: data.calories || 0,
        timestamp: timestamp,
        metadata: data.metadata || {}
      });
    });
    
    // Sort by timestamp (newest first)
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    console.log('getActivityLogs - Returning logs:', logs);
    return logs;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
};

export const deleteActivityLog = async (userId: string, logId: string) => {
  console.log('Deleting activity log:', { userId, logId });
  const logRef = doc(db, 'users', userId, 'activityLogs', logId);
  await deleteDoc(logRef);
  console.log('Activity log deleted successfully');
};

export const deleteAllActivityLogs = async (userId: string) => {
  console.log('Deleting all activity logs for user:', userId);
  const logsRef = collection(db, 'users', userId, 'activityLogs');
  const { getDocs } = await import('firebase/firestore');
  const querySnapshot = await getDocs(logsRef);
  
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log('All activity logs deleted successfully');
};