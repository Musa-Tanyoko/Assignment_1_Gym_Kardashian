export interface WorkoutSession {
  id: string;
  date: Date;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 1 | 2 | 3 | 4 | 5;
  exercises: string[];
  calories: number;
  focus: string[];
}

export interface WorkoutProgram {
  userId: string;
  fitnessGoal: string;
  workoutsPerWeek: number;
  sessions: WorkoutSession[];
  startDate: Date;
  endDate: Date;
}

export const fitnessGoals = {
  'weight-loss': {
    name: 'Weight Loss',
    description: 'Focus on cardio and strength training to burn calories and build muscle',
    workoutsPerWeek: 4,
    sessionTypes: ['cardio', 'strength', 'mixed'] as const,
    focus: ['calorie-burning', 'muscle-building', 'endurance']
  },
  'muscle-gain': {
    name: 'Muscle Gain',
    description: 'Emphasis on strength training with progressive overload',
    workoutsPerWeek: 4,
    sessionTypes: ['strength', 'mixed'] as const,
    focus: ['muscle-building', 'strength', 'progressive-overload']
  },
  'general-fitness': {
    name: 'General Fitness',
    description: 'Balanced mix of cardio, strength, and flexibility',
    workoutsPerWeek: 3,
    sessionTypes: ['strength', 'cardio', 'flexibility', 'mixed'] as const,
    focus: ['overall-fitness', 'balance', 'health']
  },
  'endurance': {
    name: 'Endurance',
    description: 'Focus on cardiovascular fitness and stamina',
    workoutsPerWeek: 5,
    sessionTypes: ['cardio', 'mixed'] as const,
    focus: ['endurance', 'stamina', 'cardiovascular']
  },
  'flexibility': {
    name: 'Flexibility',
    description: 'Emphasis on stretching and mobility work',
    workoutsPerWeek: 3,
    sessionTypes: ['flexibility', 'mixed'] as const,
    focus: ['flexibility', 'mobility', 'recovery']
  }
};

export const workoutTemplates = {
  strength: {
    beginner: {
      title: 'Beginner Strength',
      description: 'Basic strength training with bodyweight and light weights',
      duration: 45,
      difficulty: 2,
      exercises: ['Push-ups', 'Squats', 'Planks', 'Lunges', 'Wall Sit'],
      calories: 200,
      focus: ['muscle-building', 'form']
    },
    intermediate: {
      title: 'Intermediate Strength',
      description: 'Moderate intensity strength training',
      duration: 60,
      difficulty: 3,
      exercises: ['Push-ups', 'Squats', 'Planks', 'Lunges', 'Burpees', 'Mountain Climbers'],
      calories: 300,
      focus: ['muscle-building', 'strength']
    },
    advanced: {
      title: 'Advanced Strength',
      description: 'High intensity strength training',
      duration: 75,
      difficulty: 4,
      exercises: ['Burpees', 'Mountain Climbers', 'Pike Push-ups', 'Jump Squats', 'Plank Variations'],
      calories: 400,
      focus: ['muscle-building', 'strength', 'power']
    }
  },
  cardio: {
    beginner: {
      title: 'Beginner Cardio',
      description: 'Low impact cardiovascular exercise',
      duration: 30,
      difficulty: 2,
      exercises: ['Jumping Jacks', 'High Knees', 'Butt Kicks', 'March in Place'],
      calories: 150,
      focus: ['endurance', 'cardiovascular']
    },
    intermediate: {
      title: 'Intermediate Cardio',
      description: 'Moderate intensity cardio workout',
      duration: 45,
      difficulty: 3,
      exercises: ['Jumping Jacks', 'High Knees', 'Burpees', 'Mountain Climbers', 'Jump Rope'],
      calories: 250,
      focus: ['endurance', 'stamina']
    },
    advanced: {
      title: 'Advanced Cardio',
      description: 'High intensity interval training',
      duration: 60,
      difficulty: 4,
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees', 'Plank Jacks'],
      calories: 350,
      focus: ['endurance', 'stamina', 'power']
    }
  },
  flexibility: {
    beginner: {
      title: 'Beginner Flexibility',
      description: 'Basic stretching and mobility work',
      duration: 20,
      difficulty: 1,
      exercises: ['Cat-Cow Stretch', 'Child\'s Pose', 'Cobra Stretch', 'Butterfly Stretch'],
      calories: 80,
      focus: ['flexibility', 'mobility']
    },
    intermediate: {
      title: 'Intermediate Flexibility',
      description: 'Dynamic stretching and mobility',
      duration: 30,
      difficulty: 2,
      exercises: ['Sun Salutation', 'Warrior Poses', 'Triangle Pose', 'Downward Dog'],
      calories: 120,
      focus: ['flexibility', 'mobility', 'balance']
    },
    advanced: {
      title: 'Advanced Flexibility',
      description: 'Advanced stretching and mobility',
      duration: 40,
      difficulty: 3,
      exercises: ['Advanced Yoga Poses', 'Deep Stretches', 'Mobility Drills'],
      calories: 150,
      focus: ['flexibility', 'mobility', 'recovery']
    }
  },
  mixed: {
    beginner: {
      title: 'Beginner Mixed',
      description: 'Combination of cardio and strength',
      duration: 40,
      difficulty: 2,
      exercises: ['Push-ups', 'Squats', 'Jumping Jacks', 'Planks'],
      calories: 180,
      focus: ['overall-fitness', 'balance']
    },
    intermediate: {
      title: 'Intermediate Mixed',
      description: 'Balanced cardio and strength training',
      duration: 55,
      difficulty: 3,
      exercises: ['Burpees', 'Mountain Climbers', 'Push-ups', 'Squats', 'Planks'],
      calories: 280,
      focus: ['overall-fitness', 'strength', 'endurance']
    },
    advanced: {
      title: 'Advanced Mixed',
      description: 'High intensity mixed training',
      duration: 70,
      difficulty: 4,
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'Pike Push-ups', 'Plank Variations'],
      calories: 380,
      focus: ['overall-fitness', 'strength', 'endurance', 'power']
    }
  }
};

export const generateWorkoutProgram = (
  userId: string,
  fitnessGoal: string,
  workoutsPerWeek: number = 3,
  startDate: Date = new Date(),
  userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): WorkoutProgram => {
  const goal = fitnessGoals[fitnessGoal as keyof typeof fitnessGoals] || fitnessGoals['general-fitness'];
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30); // 30-day program

  const sessions: WorkoutSession[] = [];
  const sessionTypes = goal.sessionTypes;
  
  // Calculate how many weeks we need to cover (30 days = ~4.3 weeks)
  const totalWeeks = Math.ceil(30 / 7);
  const totalWorkouts = totalWeeks * workoutsPerWeek;
  
  // Generate sessions for the next 30 days
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    // Skip if it's a rest day (not a workout day)
    const dayOfWeek = currentDate.getDay();
    const isWorkoutDay = shouldWorkoutOnDay(dayOfWeek, workoutsPerWeek);
    
    if (isWorkoutDay) {
      const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
      const template = workoutTemplates[sessionType][userLevel];
      
      const session: WorkoutSession = {
        id: `session-${i}`,
        date: currentDate,
        type: sessionType,
        title: template.title,
        description: template.description,
        duration: template.duration,
        difficulty: template.difficulty as 1 | 2 | 3 | 4 | 5,
        exercises: template.exercises,
        calories: template.calories,
        focus: template.focus
      };
      
      sessions.push(session);
    }
  }

  return {
    userId,
    fitnessGoal,
    workoutsPerWeek,
    sessions,
    startDate,
    endDate
  };
};

export const shouldWorkoutOnDay = (dayOfWeek: number, workoutsPerWeek: number): boolean => {
  // Distribute workouts throughout the week with better spacing
  const workoutDays = {
    1: [2], // Tuesday only
    2: [1, 4], // Monday, Thursday
    3: [1, 3, 5], // Monday, Wednesday, Friday (most common)
    4: [1, 2, 4, 6], // Monday, Tuesday, Thursday, Saturday
    5: [1, 2, 3, 5, 6], // Monday, Tuesday, Wednesday, Friday, Saturday
    6: [1, 2, 3, 4, 5, 6], // Monday through Saturday
    7: [0, 1, 2, 3, 4, 5, 6] // Every day
  };
  
  const days = workoutDays[workoutsPerWeek as keyof typeof workoutDays] || workoutDays[3];
  const isWorkoutDay = days.includes(dayOfWeek);
  
  console.log(`shouldWorkoutOnDay - Day ${dayOfWeek} (${getDayName(dayOfWeek)}), Workouts per week: ${workoutsPerWeek}, Is workout day: ${isWorkoutDay}`);
  
  return isWorkoutDay;
};

// Helper function to get day name for debugging
const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
};

export const getWorkoutForDate = (program: WorkoutProgram, date: Date): WorkoutSession | null => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return program.sessions.find(session => {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === targetDate.getTime();
  }) || null;
};

export const getWeeklyWorkouts = (program: WorkoutProgram, weekStart: Date): WorkoutSession[] => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  return program.sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  });
};

export const determineUserLevel = (totalWorkouts: number, experience: number): 'beginner' | 'intermediate' | 'advanced' => {
  if (totalWorkouts < 10 || experience < 100) {
    return 'beginner';
  } else if (totalWorkouts < 50 || experience < 500) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
}; 