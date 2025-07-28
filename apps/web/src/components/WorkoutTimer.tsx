import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, SkipForward, X, Trophy } from 'lucide-react';
import { ProgressiveWorkout, calculateProgressiveWorkout, SocialiteStats } from '../types/socialite';

interface WorkoutTimerProps {
  user: { id: number; name: string; level: number; fame: number };
  onComplete: (credits: number, workoutMeta?: { exercises: ProgressiveWorkout['exercises']; totalDuration: number; difficulty: number }) => void;
  onClose: () => void;
  progressiveWorkout?: ProgressiveWorkout;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ user, onComplete, onClose, progressiveWorkout }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [earnedCredits, setEarnedCredits] = useState<number | null>(null);

  // Create a mock socialite for progressive workout calculation
  const mockSocialite: SocialiteStats = useMemo(() => ({
    id: 1,
    name: 'Your Socialite',
    type: 'influencer',
    level: user.level,
    age: 15,
    fame: user.fame,
    experience: 0,
    hunger: 85,
    hygiene: 70,
    happiness: 90,
    spa: 40,
    glam: 50,
    outfits: 30,
    photoshoots: 20,
    trips: 10,
    posts: 60,
    wellness: 50,
    petcare: 70,
    events: 30,
    pr: 80,
    totalWorkouts: 0,
    totalCreditsEarned: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }), [user.level, user.fame]);

  // Calculate progressive workout based on user stats
  const calculatedWorkout = useMemo(() => {
    return calculateProgressiveWorkout(mockSocialite);
  }, [mockSocialite]);

  // Use progressive workout if provided, otherwise use calculated workout
  const exercises = useMemo(() => {
    if (progressiveWorkout?.exercises) {
      return progressiveWorkout.exercises;
    }
    return calculatedWorkout.exercises;
  }, [progressiveWorkout?.exercises, calculatedWorkout.exercises]);

  // Initialize time based on first exercise
  useEffect(() => {
    if (exercises.length > 0) {
      setTimeLeft(exercises[0].baseDuration || 45);
    }
  }, [exercises]);

  const completeWorkout = useCallback(() => {
    const totalCredits = exercises.reduce((sum, ex) => sum + ex.creditReward, 0);
    const bonusCredits = Math.floor(Math.random() * 20); // Random bonus
    const credits = totalCredits + bonusCredits;
    
    setEarnedCredits(credits);
    setShowCompletion(true);
    
    // Pass workout meta to onComplete
    onComplete(credits, {
      exercises,
      totalDuration: exercises.reduce((sum, ex) => sum + (ex.baseDuration || 0), 0),
      difficulty: progressiveWorkout?.difficulty || calculatedWorkout.difficulty,
    });
  }, [exercises, progressiveWorkout?.difficulty, calculatedWorkout.difficulty, onComplete]);

  const handleNextExercise = useCallback(() => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTimeLeft(15); // Rest period
      setIsResting(true);
      setCompletedExercises(completedExercises + 1);
    } else {
      completeWorkout();
    }
  }, [currentExercise, exercises.length, completedExercises, completeWorkout]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (isResting) {
        setIsResting(false);
        setTimeLeft(exercises[currentExercise]?.baseDuration || 45);
      } else {
        handleNextExercise();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isResting, currentExercise, exercises, handleNextExercise]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const skipExercise = () => {
    handleNextExercise();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showCompletion) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Workout Complete!</h2>
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg p-4 mb-6">
            <div className="text-3xl font-bold mb-2">+{earnedCredits} Credits</div>
            <p className="text-emerald-100">Great job! Your socialite is getting pampered!</p>
          </div>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p>Exercises completed: {completedExercises + 1}</p>
            <p>Difficulty level: {progressiveWorkout?.difficulty || calculatedWorkout.difficulty}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const currentExerciseData = exercises[currentExercise];
  if (!currentExerciseData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <p className="text-gray-600">No exercises available</p>
          <button
            onClick={onClose}
            className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Workout Timer</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Exercise {currentExercise + 1} of {exercises.length}</span>
            <span>{Math.round(((currentExercise + 1) / exercises.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Exercise */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🏋️‍♀️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isResting ? 'Rest Period' : currentExerciseData.name}
          </h3>
          {!isResting && (
            <p className="text-gray-600 text-sm mb-4">{currentExerciseData.description}</p>
          )}
          
          {/* Timer */}
          <div className="text-6xl font-bold text-emerald-600 mb-4">
            {formatTime(timeLeft)}
          </div>
          
          {isResting && (
            <p className="text-gray-500 text-sm">Take a breather, next exercise coming up!</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={toggleTimer}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
          >
            {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={skipExercise}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Exercise Info */}
        {!isResting && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Sets:</span>
                <span className="font-medium ml-2">{currentExerciseData.baseSets}</span>
              </div>
              <div>
                <span className="text-gray-500">Reps:</span>
                <span className="font-medium ml-2">{currentExerciseData.baseReps}</span>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium ml-2">{currentExerciseData.baseDuration}s</span>
              </div>
              <div>
                <span className="text-gray-500">Reward:</span>
                <span className="font-medium ml-2 text-emerald-600">+{currentExerciseData.creditReward}c</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTimer;