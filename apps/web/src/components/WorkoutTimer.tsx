import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, X, Trophy, Target, TrendingUp } from 'lucide-react';
import { ProgressiveWorkout, ExerciseDifficulty } from '../types/socialite';

interface WorkoutTimerProps {
  user: any;
  onComplete: (credits: number) => void;
  onClose: () => void;
  progressiveWorkout?: ProgressiveWorkout;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ user, onComplete, onClose, progressiveWorkout }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);

  // Use progressive workout if provided, otherwise fall back to default
  const exercises = progressiveWorkout?.exercises || [
    {
      level: 1,
      name: 'Push-ups',
      description: 'Keep your body straight, lower chest to ground, push back up',
      baseSets: 3,
      baseReps: 12,
      baseDuration: 45,
      intensityMultiplier: 1.0,
      creditReward: 10,
      requirements: { minFame: 0, minLevel: 1 },
      image: '🏋️‍♀️'
    },
    {
      level: 1,
      name: 'Squats',
      description: 'Feet shoulder-width apart, lower hips back and down, stand up',
      baseSets: 3,
      baseReps: 15,
      baseDuration: 50,
      intensityMultiplier: 1.0,
      creditReward: 10,
      requirements: { minFame: 0, minLevel: 1 },
      image: '🍑'
    },
    {
      level: 1,
      name: 'Plank',
      description: 'Hold your body straight in push-up position',
      baseSets: 3,
      baseReps: '30s',
      baseDuration: 30,
      intensityMultiplier: 1.0,
      creditReward: 10,
      requirements: { minFame: 0, minLevel: 1 },
      image: '⚖️'
    },
    {
      level: 1,
      name: 'Burpees',
      description: 'Squat, jump back to plank, push-up, jump forward, jump up',
      baseSets: 2,
      baseReps: 8,
      baseDuration: 60,
      intensityMultiplier: 1.0,
      creditReward: 10,
      requirements: { minFame: 0, minLevel: 1 },
      image: '🔥'
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
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
  }, [isActive, timeLeft, isResting, currentExercise]);

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTimeLeft(15); // Rest period
      setIsResting(true);
      setCompletedExercises(completedExercises + 1);
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    const earnedCredits = Math.floor(50 + (completedExercises * 10) + Math.random() * 30);
    onComplete(earnedCredits);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const skipExercise = () => {
    handleNextExercise();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentEx = exercises[currentExercise];
  const progress = ((currentExercise + (isResting ? 1 : 0)) / exercises.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Workout Session</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isResting ? (
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">😴</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Rest Time</h3>
            <p className="text-gray-600">Take a breather before the next exercise</p>
          </div>
        ) : currentEx ? (
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{(currentEx as any).image || '🏋️‍♀️'}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{currentEx.name}</h3>
            <p className="text-gray-600 mb-4">{currentEx.description}</p>
            <div className="bg-emerald-50 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">{(currentEx as any).image || '🏋️‍♀️'}</span>
                <p className="text-emerald-800 font-medium">
                  {currentEx.baseSets} sets × {currentEx.baseReps} reps
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Workout Complete!</h3>
            <p className="text-gray-600">Great job finishing your workout session</p>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {formatTime(timeLeft)}
          </div>
          <p className="text-gray-600">
            {isResting ? 'Rest remaining' : 'Exercise time'}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
          
          {currentExercise < exercises.length && (
            <button
              onClick={skipExercise}
              className="flex items-center justify-center w-16 h-16 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Exercise List */}
        <div className="mt-6 space-y-2">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                index === currentExercise
                  ? 'bg-emerald-50 border border-emerald-200'
                  : index < currentExercise
                  ? 'bg-gray-50 text-gray-500'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <span className="text-2xl mr-3">{(exercise as any).image || '🏋️‍♀️'}</span>
              <div className="flex-1">
                <p className="font-medium">{exercise.name}</p>
                <p className="text-sm text-gray-500">
                  {exercise.baseSets} sets × {exercise.baseReps}
                </p>
              </div>
              {index < currentExercise && (
                <Trophy className="w-5 h-5 text-emerald-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimer;