import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function getUserStats(userId: string) {
  try {
    // Get all workouts for the user
    const workoutsSnap = await db.collection('workouts').where('userId', '==', userId).get();
    
    if (workoutsSnap.empty) {
      // Return default values for new users
      return {
        sessions: 0,
        exercisesCompleted: 0,
        streak: 0,
        hours: 0,
        totalCalories: 0,
        averageWorkoutDuration: 0,
        lastWorkoutDate: null,
        weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
        monthlyProgress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
    }

    let totalSessions = 0;
    let totalExercisesCompleted = 0;
    let totalHours = 0;
    let totalCalories = 0;
    let workoutDates: Date[] = [];
    let lastWorkoutDate: Date | null = null;

    workoutsSnap.forEach(doc => {
      const data = doc.data();
      if (data.completed) {
        totalSessions += 1;
        totalExercisesCompleted += data.exercises?.length || 0;
        totalHours += data.totalDuration ? data.totalDuration / 60 : 0;
        totalCalories += data.creditsEarned ? data.creditsEarned * 10 : 0; // Rough estimate: 10 calories per credit
        
        if (data.createdAt) {
          const workoutDate = new Date(data.createdAt);
          workoutDates.push(workoutDate);
          if (!lastWorkoutDate || workoutDate > lastWorkoutDate) {
            lastWorkoutDate = workoutDate;
          }
        }
      }
    });

    // Calculate current streak
    let currentStreak = 0;
    if (workoutDates.length > 0) {
      workoutDates.sort((a, b) => b.getTime() - a.getTime()); // Sort by most recent first
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let currentDate = today;
      let consecutiveDays = 0;
      
      for (const workoutDate of workoutDates) {
        const workoutDay = new Date(workoutDate);
        workoutDay.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((currentDate.getTime() - workoutDay.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) {
          consecutiveDays++;
          currentDate = workoutDay;
        } else {
          break;
        }
      }
      
      currentStreak = consecutiveDays;
    }

    // Calculate average workout duration
    const averageWorkoutDuration = totalSessions > 0 ? Math.round(totalHours * 60 / totalSessions) : 0;

    return {
      sessions: totalSessions,
      exercisesCompleted: totalExercisesCompleted,
      streak: currentStreak,
      hours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
      totalCalories: Math.round(totalCalories),
      averageWorkoutDuration,
      lastWorkoutDate: lastWorkoutDate?.toISOString() || null,
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0], // TODO: Calculate from real data
      monthlyProgress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // TODO: Calculate from real data
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Return default values on error
    return {
      sessions: 0,
      exercisesCompleted: 0,
      streak: 0,
      hours: 0,
      totalCalories: 0,
      averageWorkoutDuration: 0,
      lastWorkoutDate: null,
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
      monthlyProgress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  }
}
