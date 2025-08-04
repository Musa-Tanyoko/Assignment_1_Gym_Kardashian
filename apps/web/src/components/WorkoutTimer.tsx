import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, SkipForward, X, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressiveWorkout, calculateProgressiveWorkout, SocialiteStats } from '../types/socialite';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

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
    
    console.log('WorkoutTimer - Exercises:', exercises);
    console.log('WorkoutTimer - Total credits from exercises:', totalCredits);
    console.log('WorkoutTimer - Bonus credits:', bonusCredits);
    console.log('WorkoutTimer - Total credits to award:', credits);
    console.log('WorkoutTimer - Progressive workout provided:', !!progressiveWorkout);
    console.log('WorkoutTimer - Calculated workout:', calculatedWorkout);
    
    setEarnedCredits(credits);
    setShowCompletion(true);
    
    // Pass workout meta to onComplete
    const workoutMeta = {
      exercises,
      totalDuration: exercises.reduce((sum, ex) => sum + (ex.baseDuration || 0), 0),
      difficulty: progressiveWorkout?.difficulty || calculatedWorkout.difficulty,
    };
    
    console.log('WorkoutTimer - Calling onComplete with workoutMeta:', workoutMeta);
    onComplete(credits, workoutMeta);
  }, [exercises, progressiveWorkout?.difficulty, calculatedWorkout.difficulty, onComplete, progressiveWorkout, calculatedWorkout]);

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
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="max-w-md w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <Card>
            <CardContent className="p-8 text-center">
              <motion.div 
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                🎉
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Workout Complete!
              </motion.h2>
              <motion.div 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-3xl font-bold mb-2">+{earnedCredits} Credits</div>
                <p className="text-emerald-100">Great job! Your socialite is getting pampered!</p>
              </motion.div>
              <motion.div 
                className="space-y-2 text-sm text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p>Exercises completed: {completedExercises + 1}</p>
                <p>Difficulty level: {progressiveWorkout?.difficulty || calculatedWorkout.difficulty}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={onClose}
                  className="w-full"
                >
                  Continue
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  const currentExerciseData = exercises[currentExercise];
  if (!currentExerciseData) {
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No exercises available</p>
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-4"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <CardTitle className="text-2xl">Workout Timer</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Progress */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Exercise {currentExercise + 1} of {exercises.length}</span>
                <span>{Math.round(((currentExercise + 1) / exercises.length) * 100)}%</span>
              </div>
              <Progress value={((currentExercise + 1) / exercises.length) * 100} className="h-2" />
            </motion.div>

            {/* Current Exercise */}
            <motion.div 
              className="text-center mb-6"
              key={currentExercise}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                🏋️‍♀️
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isResting ? 'Rest Period' : currentExerciseData.name}
              </h3>
              {!isResting && (
                <p className="text-gray-600 text-sm mb-4">{currentExerciseData.description}</p>
              )}
              
              {/* Timer */}
              <motion.div 
                className="text-6xl font-bold text-emerald-600 mb-4"
                key={timeLeft}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatTime(timeLeft)}
              </motion.div>
              
              {isResting && (
                <p className="text-gray-500 text-sm">Take a breather, next exercise coming up!</p>
              )}
            </motion.div>

            {/* Controls */}
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="gradient"
                size="lg"
                onClick={toggleTimer}
                className="flex-1"
              >
                {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isActive ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={skipExercise}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Exercise Info */}
            {!isResting && (
              <motion.div 
                className="mt-6 p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
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
                    <Badge variant="success" className="ml-2">
                      +{currentExerciseData.creditReward}c
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default WorkoutTimer;