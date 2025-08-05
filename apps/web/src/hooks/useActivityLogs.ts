import { useState, useEffect } from 'react';
import { saveActivityLog, getActivityLogs, deleteAllActivityLogs } from '../lib/firebase-client';

export interface ActivityLog {
  id: string;
  type: 'workout' | 'steps' | 'exercise' | 'cardio' | 'yoga' | 'strength';
  title: string;
  time: string;
  duration: string;
  calories: number;
  timestamp: Date;
  metadata?: {
    steps?: number;
    exercises?: string[];
    heartRate?: number;
    distance?: number;
  };
}

export const useActivityLogs = (userId: string) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const loadLogs = async () => {
    console.log('useActivityLogs - Loading logs for userId:', userId);
    const logs = await getActivityLogs(userId);
    console.log('useActivityLogs - Loaded logs:', logs);
    setActivityLogs(logs);
  };

  useEffect(() => {
    if (userId) {
      loadLogs();
    }
  }, [userId]);

  useEffect(() => {
    // Real-time updates can be added here with onSnapshot if needed
  }, [activityLogs]);

  const addActivityLog = async (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    await saveActivityLog(userId, newLog);
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addWorkoutLog = (duration: number, calories: number, exercises: string[] = []) => {
    addActivityLog({
      type: 'workout',
      title: 'Progressive Workout Completed',
      time: 'Just now',
      duration: `${duration} min`,
      calories,
      metadata: { exercises }
    });
  };

  const addStepsLog = (steps: number, calories: number) => {
    addActivityLog({
      type: 'steps',
      title: 'Daily Steps Goal Reached',
      time: 'Just now',
      duration: `${steps.toLocaleString()} steps`,
      calories,
      metadata: { steps }
    });
  };

  const addExerciseLog = (exerciseType: string, duration: number, calories: number) => {
    addActivityLog({
      type: 'exercise',
      title: `${exerciseType} Session`,
      time: 'Just now',
      duration: `${duration} min`,
      calories,
      metadata: { exercises: [exerciseType] }
    });
  };

  const getRecentLogs = (limit: number = 10) => {
    return activityLogs.slice(0, limit).map(log => ({
      ...log,
      time: formatRelativeTime(log.timestamp)
    }));
  };

  const formatRelativeTime = (timestamp: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getLogsByType = (type: ActivityLog['type']) => {
    return activityLogs.filter(log => log.type === type);
  };

  const getTodayLogs = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return activityLogs.filter(log => log.timestamp >= today);
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyLogs = activityLogs.filter(log => log.timestamp >= weekAgo);
    
    return {
      totalWorkouts: weeklyLogs.filter(log => log.type === 'workout').length,
      totalSteps: weeklyLogs
        .filter(log => log.type === 'steps')
        .reduce((sum, log) => sum + (log.metadata?.steps || 0), 0),
      totalCalories: weeklyLogs.reduce((sum, log) => sum + log.calories, 0),
      totalDuration: weeklyLogs
        .filter(log => log.type !== 'steps')
        .reduce((sum, log) => {
          const duration = parseInt(log.duration.split(' ')[0]);
          return sum + (isNaN(duration) ? 0 : duration);
        }, 0)
    };
  };

  const clearLogs = async () => {
    // Implement clear logic with Firebase if needed
    setActivityLogs([]);
  };

  const refreshLogs = async () => {
    await loadLogs();
  };



  return {
    activityLogs,
    addActivityLog,
    addWorkoutLog,
    addStepsLog,
    addExerciseLog,
    getRecentLogs,
    getLogsByType,
    getTodayLogs,
    getWeeklyStats,
    clearLogs,
    refreshLogs
  };
};