export interface SocialiteStats {
  id: number;
  name: string;
  type: SocialiteType;
  level: number;
  age: number;
  fame: number;
  experience: number;
  
  // Basic needs (deplete over time)
  hunger: number;
  hygiene: number;
  happiness: number;
  
  // Luxury needs (socialite specific)
  spa: number;
  glam: number;
  outfits: number;
  photoshoots: number;
  trips: number;
  posts: number;
  wellness: number;
  petcare: number;
  events: number;
  pr: number;
  
  // Progression tracking
  totalWorkouts: number;
  totalCreditsEarned: number;
  lastWorkoutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SocialiteType = 'influencer' | 'celebrity' | 'mogul' | 'icon';

export interface FameLevel {
  level: number;
  name: string;
  fameRequired: number;
  type: SocialiteType;
  emoji: string;
  description: string;
  needsMultiplier: number;
  exerciseIntensityMultiplier: number;
  creditMultiplier: number;
  demands: SocialiteDemands;
}

export interface SocialiteDemands {
  baseDepletionRate: number;
  luxuryDepletionRate: number;
  minimumNeeds: number;
  fameDecayRate: number;
}

export interface ExerciseDifficulty {
  level: number;
  name: string;
  description: string;
  baseSets: number;
  baseReps: number;
  baseDuration: number;
  intensityMultiplier: number;
  creditReward: number;
  requirements: {
    minFame: number;
    minLevel: number;
  };
}

export interface ProgressiveWorkout {
  exercises: ExerciseDifficulty[];
  totalDuration: number;
  difficulty: number;
  creditReward: number;
  fameReward: number;
  experienceReward: number;
}

// Fame level progression system
export const FAME_LEVELS: FameLevel[] = [
  {
    level: 1,
    name: 'Micro Influencer',
    fameRequired: 0,
    type: 'influencer',
    emoji: '💅',
    description: 'Just starting out in the social media world',
    needsMultiplier: 1.0,
    exerciseIntensityMultiplier: 1.0,
    creditMultiplier: 1.0,
    demands: {
      baseDepletionRate: 2,
      luxuryDepletionRate: 1,
      minimumNeeds: 30,
      fameDecayRate: 0.5
    }
  },
  {
    level: 2,
    name: 'Rising Star',
    fameRequired: 200,
    type: 'influencer',
    emoji: '⭐',
    description: 'Gaining followers and brand attention',
    needsMultiplier: 1.2,
    exerciseIntensityMultiplier: 1.1,
    creditMultiplier: 1.1,
    demands: {
      baseDepletionRate: 2.5,
      luxuryDepletionRate: 1.5,
      minimumNeeds: 40,
      fameDecayRate: 0.8
    }
  },
  {
    level: 3,
    name: 'Celebrity',
    fameRequired: 500,
    type: 'celebrity',
    emoji: '👑',
    description: 'Recognized in public, paparazzi attention',
    needsMultiplier: 1.5,
    exerciseIntensityMultiplier: 1.3,
    creditMultiplier: 1.3,
    demands: {
      baseDepletionRate: 3,
      luxuryDepletionRate: 2,
      minimumNeeds: 50,
      fameDecayRate: 1.2
    }
  },
  {
    level: 4,
    name: 'A-List Star',
    fameRequired: 1000,
    type: 'celebrity',
    emoji: '🌟',
    description: 'Household name, major brand deals',
    needsMultiplier: 1.8,
    exerciseIntensityMultiplier: 1.5,
    creditMultiplier: 1.5,
    demands: {
      baseDepletionRate: 3.5,
      luxuryDepletionRate: 2.5,
      minimumNeeds: 60,
      fameDecayRate: 1.5
    }
  },
  {
    level: 5,
    name: 'Business Mogul',
    fameRequired: 2000,
    type: 'mogul',
    emoji: '👜',
    description: 'Building empires, multiple revenue streams',
    needsMultiplier: 2.0,
    exerciseIntensityMultiplier: 1.8,
    creditMultiplier: 1.8,
    demands: {
      baseDepletionRate: 4,
      luxuryDepletionRate: 3,
      minimumNeeds: 70,
      fameDecayRate: 2.0
    }
  },
  {
    level: 6,
    name: 'Cultural Icon',
    fameRequired: 5000,
    type: 'icon',
    emoji: '🏆',
    description: 'Legendary status, influence beyond entertainment',
    needsMultiplier: 2.5,
    exerciseIntensityMultiplier: 2.0,
    creditMultiplier: 2.0,
    demands: {
      baseDepletionRate: 5,
      luxuryDepletionRate: 4,
      minimumNeeds: 80,
      fameDecayRate: 2.5
    }
  }
];

// Exercise difficulty progression
export const EXERCISE_DIFFICULTIES: ExerciseDifficulty[] = [
  {
    level: 1,
    name: 'Beginner',
    description: 'Perfect for newcomers to fitness',
    baseSets: 2,
    baseReps: 8,
    baseDuration: 30,
    intensityMultiplier: 1.0,
    creditReward: 10,
    requirements: { minFame: 0, minLevel: 1 }
  },
  {
    level: 2,
    name: 'Novice',
    description: 'Building strength and endurance',
    baseSets: 3,
    baseReps: 10,
    baseDuration: 40,
    intensityMultiplier: 1.2,
    creditReward: 15,
    requirements: { minFame: 100, minLevel: 2 }
  },
  {
    level: 3,
    name: 'Intermediate',
    description: 'Challenging workouts for experienced users',
    baseSets: 3,
    baseReps: 12,
    baseDuration: 50,
    intensityMultiplier: 1.5,
    creditReward: 20,
    requirements: { minFame: 300, minLevel: 3 }
  },
  {
    level: 4,
    name: 'Advanced',
    description: 'Intense training for serious fitness enthusiasts',
    baseSets: 4,
    baseReps: 15,
    baseDuration: 60,
    intensityMultiplier: 1.8,
    creditReward: 25,
    requirements: { minFame: 800, minLevel: 4 }
  },
  {
    level: 5,
    name: 'Elite',
    description: 'Professional-level intensity and complexity',
    baseSets: 4,
    baseReps: 20,
    baseDuration: 75,
    intensityMultiplier: 2.2,
    creditReward: 35,
    requirements: { minFame: 1500, minLevel: 5 }
  },
  {
    level: 6,
    name: 'Legendary',
    description: 'Ultimate challenge for the most dedicated',
    baseSets: 5,
    baseReps: 25,
    baseDuration: 90,
    intensityMultiplier: 2.5,
    creditReward: 50,
    requirements: { minFame: 3000, minLevel: 6 }
  }
];

// Exercise library with progressive scaling
export interface ExerciseProgression {
  sets: number;
  reps: number | string;
  duration: number;
}

export interface ExerciseData {
  name: string;
  description: string;
  image: string;
  baseSets: number;
  baseReps: number | string;
  baseDuration: number;
  progression: Record<number, ExerciseProgression>;
}

export const EXERCISE_LIBRARY: Record<string, ExerciseData> = {
  'Push-ups': {
    name: 'Push-ups',
    description: 'Keep your body straight, lower chest to ground, push back up',
    image: '🏋️‍♀️',
    baseSets: 3,
    baseReps: 12,
    baseDuration: 45,
    progression: {
      1: { sets: 2, reps: 8, duration: 30 },
      2: { sets: 3, reps: 10, duration: 40 },
      3: { sets: 3, reps: 12, duration: 45 },
      4: { sets: 4, reps: 15, duration: 60 },
      5: { sets: 4, reps: 20, duration: 75 },
      6: { sets: 5, reps: 25, duration: 90 }
    }
  },
  'Squats': {
    name: 'Squats',
    description: 'Feet shoulder-width apart, lower hips back and down, stand up',
    image: '🍑',
    baseSets: 3,
    baseReps: 15,
    baseDuration: 50,
    progression: {
      1: { sets: 2, reps: 10, duration: 35 },
      2: { sets: 3, reps: 12, duration: 45 },
      3: { sets: 3, reps: 15, duration: 50 },
      4: { sets: 4, reps: 18, duration: 65 },
      5: { sets: 4, reps: 22, duration: 80 },
      6: { sets: 5, reps: 25, duration: 95 }
    }
  },
  'Plank': {
    name: 'Plank',
    description: 'Hold your body straight in push-up position',
    image: '⚖️',
    baseSets: 3,
    baseReps: '30s',
    baseDuration: 30,
    progression: {
      1: { sets: 2, reps: '20s', duration: 20 },
      2: { sets: 3, reps: '25s', duration: 25 },
      3: { sets: 3, reps: '30s', duration: 30 },
      4: { sets: 4, reps: '40s', duration: 40 },
      5: { sets: 4, reps: '50s', duration: 50 },
      6: { sets: 5, reps: '60s', duration: 60 }
    }
  },
  'Burpees': {
    name: 'Burpees',
    description: 'Squat, jump back to plank, push-up, jump forward, jump up',
    image: '🔥',
    baseSets: 2,
    baseReps: 8,
    baseDuration: 60,
    progression: {
      1: { sets: 1, reps: 5, duration: 45 },
      2: { sets: 2, reps: 6, duration: 50 },
      3: { sets: 2, reps: 8, duration: 60 },
      4: { sets: 3, reps: 10, duration: 75 },
      5: { sets: 3, reps: 12, duration: 90 },
      6: { sets: 4, reps: 15, duration: 105 }
    }
  },
  'Mountain Climbers': {
    name: 'Mountain Climbers',
    description: 'Alternate bringing knees to chest in plank position',
    image: '🏃‍♀️',
    baseSets: 3,
    baseReps: 20,
    baseDuration: 40,
    progression: {
      1: { sets: 2, reps: 15, duration: 30 },
      2: { sets: 3, reps: 18, duration: 35 },
      3: { sets: 3, reps: 20, duration: 40 },
      4: { sets: 4, reps: 25, duration: 50 },
      5: { sets: 4, reps: 30, duration: 60 },
      6: { sets: 5, reps: 35, duration: 70 }
    }
  },
  'Jumping Jacks': {
    name: 'Jumping Jacks',
    description: 'Jump while raising arms and spreading legs',
    image: '🤸‍♀️',
    baseSets: 3,
    baseReps: 25,
    baseDuration: 35,
    progression: {
      1: { sets: 2, reps: 20, duration: 25 },
      2: { sets: 3, reps: 22, duration: 30 },
      3: { sets: 3, reps: 25, duration: 35 },
      4: { sets: 4, reps: 30, duration: 45 },
      5: { sets: 4, reps: 35, duration: 55 },
      6: { sets: 5, reps: 40, duration: 65 }
    }
  }
};

// Utility functions for progression system
export const getCurrentFameLevel = (fame: number): FameLevel => {
  return FAME_LEVELS.reduce((current, level) => {
    return fame >= level.fameRequired ? level : current;
  }, FAME_LEVELS[0]);
};

export const getNextFameLevel = (fame: number): FameLevel | null => {
  const currentLevel = getCurrentFameLevel(fame);
  const nextLevelIndex = FAME_LEVELS.findIndex(level => level.level === currentLevel.level) + 1;
  return nextLevelIndex < FAME_LEVELS.length ? FAME_LEVELS[nextLevelIndex] : null;
};

export const getExerciseDifficulty = (socialiteLevel: number, fame: number): ExerciseDifficulty => {
  return EXERCISE_DIFFICULTIES.reduce((current, difficulty) => {
    if (fame >= difficulty.requirements.minFame && socialiteLevel >= difficulty.requirements.minLevel) {
      return difficulty;
    }
    return current;
  }, EXERCISE_DIFFICULTIES[0]);
};

export const calculateProgressiveWorkout = (
  socialite: SocialiteStats,
  exerciseNames: string[] = ['Push-ups', 'Squats', 'Plank', 'Burpees']
): ProgressiveWorkout => {
  const fameLevel = getCurrentFameLevel(socialite.fame);
  const difficulty = getExerciseDifficulty(socialite.level, socialite.fame);
  
  const exercises = exerciseNames.map(name => {
    const exercise = EXERCISE_LIBRARY[name];
    if (!exercise) return null;
    
    const progression = exercise.progression[difficulty.level] || exercise.progression[1];
    
    return {
      level: difficulty.level,
      name: exercise.name,
      description: exercise.description,
      baseSets: progression.sets,
      baseReps: progression.reps,
      baseDuration: progression.duration,
      intensityMultiplier: difficulty.intensityMultiplier,
      creditReward: Math.floor(difficulty.creditReward * fameLevel.creditMultiplier),
      requirements: difficulty.requirements
    };
  }).filter((ex): ex is ExerciseDifficulty => ex !== null);

  const totalDuration = exercises.reduce((sum, ex) => sum + ex.baseDuration, 0);
  const totalCreditReward = exercises.reduce((sum, ex) => sum + ex.creditReward, 0);
  
  return {
    exercises,
    totalDuration,
    difficulty: difficulty.level,
    creditReward: totalCreditReward,
    fameReward: Math.floor(totalCreditReward * 0.1),
    experienceReward: Math.floor(totalCreditReward * 0.2)
  };
};

export const calculateNeedsDepletion = (
  socialite: SocialiteStats,
  hoursPassed: number = 1
): Partial<SocialiteStats> => {
  const fameLevel = getCurrentFameLevel(socialite.fame);
  const demands = fameLevel.demands;
  
  const depletion = {
    hunger: Math.max(0, socialite.hunger - (demands.baseDepletionRate * hoursPassed)),
    hygiene: Math.max(0, socialite.hygiene - (demands.baseDepletionRate * hoursPassed)),
    happiness: Math.max(0, socialite.happiness - (demands.baseDepletionRate * hoursPassed)),
    spa: Math.max(0, socialite.spa - (demands.luxuryDepletionRate * hoursPassed)),
    glam: Math.max(0, socialite.glam - (demands.luxuryDepletionRate * hoursPassed)),
    outfits: Math.max(0, socialite.outfits - (demands.luxuryDepletionRate * hoursPassed)),
    photoshoots: Math.max(0, socialite.photoshoots - (demands.luxuryDepletionRate * hoursPassed)),
    trips: Math.max(0, socialite.trips - (demands.luxuryDepletionRate * hoursPassed)),
    posts: Math.max(0, socialite.posts - (demands.luxuryDepletionRate * hoursPassed)),
    wellness: Math.max(0, socialite.wellness - (demands.luxuryDepletionRate * hoursPassed)),
    petcare: Math.max(0, socialite.petcare - (demands.luxuryDepletionRate * hoursPassed)),
    events: Math.max(0, socialite.events - (demands.luxuryDepletionRate * hoursPassed)),
    pr: Math.max(0, socialite.pr - (demands.luxuryDepletionRate * hoursPassed)),
    fame: Math.max(0, socialite.fame - (demands.fameDecayRate * hoursPassed))
  };
  
  return depletion;
};

export const checkLevelUp = (socialite: SocialiteStats): FameLevel | null => {
  const nextLevel = getNextFameLevel(socialite.fame);
  if (nextLevel && socialite.fame >= nextLevel.fameRequired) {
    return nextLevel;
  }
  return null;
};

export const initialSocialite = (userId: string): SocialiteStats => ({
  id: Date.now(),
  name: 'Your Socialite',
  type: 'influencer',
  level: 1,
  age: 0,
  fame: 0,
  experience: 0,
  hunger: 100,
  hygiene: 100,
  happiness: 100,
  spa: 0,
  glam: 0,
  outfits: 0,
  photoshoots: 0,
  trips: 0,
  posts: 0,
  wellness: 0,
  petcare: 0,
  events: 0,
  pr: 0,
  totalWorkouts: 0,
  totalCreditsEarned: 0,
  createdAt: new Date(),
  updatedAt: new Date()
});