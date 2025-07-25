import { useState, useEffect, useCallback } from 'react';
import {
  SocialiteStats,
  FameLevel,
  ExerciseDifficulty,
  ProgressiveWorkout,
  getCurrentFameLevel,
  getNextFameLevel,
  getExerciseDifficulty,
  calculateProgressiveWorkout,
  calculateNeedsDepletion,
  EXERCISE_DIFFICULTIES
} from '../types/socialite';

interface UseProgressiveDifficultyProps {
  initialSocialite: SocialiteStats;
  onLevelUp?: (newLevel: FameLevel) => void;
  onNeedsUpdate?: (updatedNeeds: Partial<SocialiteStats>) => void;
}

export const useProgressiveDifficulty = ({
  initialSocialite,
  onLevelUp,
  onNeedsUpdate
}: UseProgressiveDifficultyProps) => {
  const [socialite, setSocialite] = useState<SocialiteStats>(initialSocialite);
  const [currentFameLevel, setCurrentFameLevel] = useState<FameLevel>(getCurrentFameLevel(initialSocialite.fame));
  const [nextFameLevel, setNextFameLevel] = useState<FameLevel | null>(getNextFameLevel(initialSocialite.fame));
  const [currentDifficulty, setCurrentDifficulty] = useState<ExerciseDifficulty>(getExerciseDifficulty(initialSocialite.level, initialSocialite.fame));
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Update fame level when fame changes
  useEffect(() => {
    const newFameLevel = getCurrentFameLevel(socialite.fame);
    const newNextLevel = getNextFameLevel(socialite.fame);
    
    if (newFameLevel.level !== currentFameLevel.level) {
      setCurrentFameLevel(newFameLevel);
      if (onLevelUp) {
        onLevelUp(newFameLevel);
      }
    }
    
    setNextFameLevel(newNextLevel);
  }, [socialite.fame, currentFameLevel.level, onLevelUp]);

  // Update exercise difficulty when level or fame changes
  useEffect(() => {
    const newDifficulty = getExerciseDifficulty(socialite.level, socialite.fame);
    setCurrentDifficulty(newDifficulty);
  }, [socialite.level, socialite.fame]);

  // Simulate needs depletion over time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hoursPassed = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
      
      if (hoursPassed >= 0.1) { // Update every 6 minutes for demo purposes
        const depletion = calculateNeedsDepletion(socialite, hoursPassed);
        const updatedSocialite = { ...socialite, ...depletion, updatedAt: now };
        
        setSocialite(updatedSocialite);
        setLastUpdate(now);
        
        if (onNeedsUpdate) {
          onNeedsUpdate(depletion);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [socialite, lastUpdate, onNeedsUpdate]);

  // Update socialite stats
  const updateSocialite = useCallback((updates: Partial<SocialiteStats>) => {
    setSocialite(prev => ({ ...prev, ...updates, updatedAt: new Date() }));
  }, []);

  // Complete a workout and update stats
  const completeWorkout = useCallback((workout: ProgressiveWorkout) => {
    const now = new Date();
    const updatedSocialite: SocialiteStats = {
      ...socialite,
      fame: socialite.fame + workout.fameReward,
      experience: socialite.experience + workout.experienceReward,
      totalWorkouts: socialite.totalWorkouts + 1,
      totalCreditsEarned: socialite.totalCreditsEarned + workout.creditReward,
      lastWorkoutDate: now,
      updatedAt: now
    };

    setSocialite(updatedSocialite);
    return workout.creditReward;
  }, [socialite]);

  // Generate a progressive workout based on current stats
  const generateWorkout = useCallback((exerciseNames?: string[]): ProgressiveWorkout => {
    return calculateProgressiveWorkout(socialite, exerciseNames);
  }, [socialite]);

  // Check if socialite can level up
  const canLevelUp = useCallback((): boolean => {
    return nextFameLevel !== null && socialite.fame >= nextFameLevel.fameRequired;
  }, [nextFameLevel, socialite.fame]);

  // Get progress to next level
  const getLevelProgress = useCallback((): { current: number; required: number; percentage: number } => {
    if (!nextFameLevel) {
      return { current: socialite.fame, required: socialite.fame, percentage: 100 };
    }
    
    const current = socialite.fame - currentFameLevel.fameRequired;
    const required = nextFameLevel.fameRequired - currentFameLevel.fameRequired;
    const percentage = Math.min(100, (current / required) * 100);
    
    return { current, required, percentage };
  }, [socialite.fame, currentFameLevel, nextFameLevel]);

  // Get available exercise difficulties
  const getAvailableDifficulties = useCallback((): ExerciseDifficulty[] => {
    return EXERCISE_DIFFICULTIES.filter(difficulty => 
      socialite.fame >= difficulty.requirements.minFame && 
      socialite.level >= difficulty.requirements.minLevel
    );
  }, [socialite.fame, socialite.level]);

  // Get socialite status summary
  const getStatusSummary = useCallback(() => {
    const levelProgress = getLevelProgress();
    const availableDifficulties = getAvailableDifficulties();
    
    return {
      currentLevel: currentFameLevel,
      nextLevel: nextFameLevel,
      levelProgress,
      currentDifficulty,
      availableDifficulties,
      canLevelUp: canLevelUp(),
      totalWorkouts: socialite.totalWorkouts,
      totalCreditsEarned: socialite.totalCreditsEarned,
      averageCreditsPerWorkout: socialite.totalWorkouts > 0 
        ? Math.round(socialite.totalCreditsEarned / socialite.totalWorkouts) 
        : 0
    };
  }, [
    currentFameLevel,
    nextFameLevel,
    currentDifficulty,
    socialite.totalWorkouts,
    socialite.totalCreditsEarned,
    getLevelProgress,
    getAvailableDifficulties,
    canLevelUp
  ]);

  return {
    socialite,
    currentFameLevel,
    nextFameLevel,
    currentDifficulty,
    updateSocialite,
    completeWorkout,
    generateWorkout,
    canLevelUp,
    getLevelProgress,
    getAvailableDifficulties,
    getStatusSummary
  };
}; 