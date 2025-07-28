import React, { useState } from 'react';
import { 
  TrendingUp, 
  Star, 
  Target, 
  Trophy, 
  Zap,
  Crown,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  SocialiteStats, 
  FAME_LEVELS, 
  EXERCISE_DIFFICULTIES,
  getCurrentFameLevel,
  getNextFameLevel,
  getExerciseDifficulty,
  calculateProgressiveWorkout
} from '../types/socialite';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface ProgressiveDifficultyDemoProps {
  onNavigate: (route: string) => void;
}

const ProgressiveDifficultyDemo: React.FC<ProgressiveDifficultyDemoProps> = ({ onNavigate }) => {
  const [currentFame, setCurrentFame] = useState(100);
  const [currentLevel, setCurrentLevel] = useState(1);
  
  const currentFameLevel = getCurrentFameLevel(currentFame);
  const nextFameLevel = getNextFameLevel(currentFame);
  const currentDifficulty = getExerciseDifficulty(currentLevel, currentFame);
  const levelProgress = nextFameLevel 
    ? Math.min(100, ((currentFame - currentFameLevel.fameRequired) / (nextFameLevel.fameRequired - currentFameLevel.fameRequired)) * 100)
    : 100;

  const demoSocialite: SocialiteStats = {
    id: 1,
    name: 'Demo Socialite',
    type: currentFameLevel.type,
    level: currentLevel,
    age: 15,
    fame: currentFame,
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
  };

  const progressiveWorkout = calculateProgressiveWorkout(demoSocialite);

  const addFame = (amount: number) => {
    setCurrentFame(prev => Math.min(5000, prev + amount));
  };

  const addLevel = () => {
    setCurrentLevel(prev => Math.min(6, prev + 1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm shadow-sm"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="flex items-center"
            >
              ← Back to Home
            </Button>
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Progressive Difficulty Demo
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full">
                <Star className="w-4 h-4" />
                <span className="font-semibold">{currentFame}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-3 py-1 rounded-full">
                <Crown className="w-4 h-4" />
                <span className="font-semibold">{currentLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Progressive Difficulty System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Watch how your socialite grows in fame and demands, which increases exercise intensity 
            and creates a challenging progression system that keeps workouts engaging.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          variants={itemVariants}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Demo Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Add Fame</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        onClick={() => addFame(50)}
                        className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200"
                      >
                        +50 Fame
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        onClick={() => addFame(100)}
                        className="w-full bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200"
                      >
                        +100 Fame
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        onClick={() => addFame(200)}
                        className="w-full bg-red-100 hover:bg-red-200 text-red-800 border-red-200"
                      >
                        +200 Fame
                      </Button>
                    </motion.div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Increase Level</h3>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      onClick={addLevel}
                      disabled={currentLevel >= 6}
                      className="w-full bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200"
                    >
                      Level Up (+1)
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Fame Level Progression */}
          <motion.div
            variants={itemVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Fame Level Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Level */}
                  <motion.div 
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{currentFameLevel.name}</h3>
                      <span className="text-2xl">{currentFameLevel.emoji}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{currentFameLevel.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Needs Multiplier:</span>
                        <span className="font-medium ml-2">{currentFameLevel.needsMultiplier}x</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Credit Multiplier:</span>
                        <span className="font-medium ml-2">{currentFameLevel.creditMultiplier}x</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Exercise Intensity:</span>
                        <span className="font-medium ml-2">{currentFameLevel.exerciseIntensityMultiplier}x</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Fame Required:</span>
                        <span className="font-medium ml-2">{currentFameLevel.fameRequired}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Progress to Next Level */}
                  {nextFameLevel && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Progress to {nextFameLevel.name}</span>
                        <span className="text-sm text-gray-500">{Math.round(levelProgress)}%</span>
                      </div>
                      <Progress value={levelProgress} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {currentFame - currentFameLevel.fameRequired} / {nextFameLevel.fameRequired - currentFameLevel.fameRequired} fame points
                      </div>
                    </div>
                  )}

                  {/* All Fame Levels */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">All Fame Levels</h4>
                    {FAME_LEVELS.map((level, index) => (
                      <motion.div
                        key={level.level}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                          level.level === currentFameLevel.level
                            ? 'bg-purple-100 border border-purple-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{level.emoji}</span>
                          <div>
                            <div className="font-medium text-sm">{level.name}</div>
                            <div className="text-xs text-gray-500">{level.fameRequired} fame required</div>
                          </div>
                        </div>
                        {level.level === currentFameLevel.level && (
                          <Sparkles className="w-4 h-4 text-purple-500" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exercise Difficulty */}
          <motion.div
            variants={itemVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-500" />
                  Exercise Difficulty Scaling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Difficulty */}
                  <motion.div 
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{currentDifficulty.name}</h3>
                      <span className="text-2xl">🏋️‍♀️</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{currentDifficulty.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Intensity:</span>
                        <span className="font-medium ml-2">{currentDifficulty.intensityMultiplier}x</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Base Reward:</span>
                        <span className="font-medium ml-2">{currentDifficulty.creditReward} credits</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Min Fame:</span>
                        <span className="font-medium ml-2">{currentDifficulty.requirements.minFame}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Min Level:</span>
                        <span className="font-medium ml-2">{currentDifficulty.requirements.minLevel}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Progressive Workout Preview */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Sample Progressive Workout</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="space-y-2">
                        {progressiveWorkout.exercises.map((exercise, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center justify-between text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-gray-700">{exercise.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">{exercise.baseSets}×{exercise.baseReps}</span>
                              <Badge variant="success" className="text-xs">
                                +{exercise.creditReward}c
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex items-center justify-between font-medium">
                            <span>Total Reward:</span>
                            <Badge variant="success">
                              {progressiveWorkout.creditReward} credits
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Fame Gain:</span>
                            <span>+{progressiveWorkout.fameReward} fame</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* All Difficulties */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">All Difficulty Levels</h4>
                    {EXERCISE_DIFFICULTIES.map((difficulty, index) => (
                      <motion.div
                        key={difficulty.level}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                          difficulty.level === currentDifficulty.level
                            ? 'bg-blue-100 border border-blue-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-sm">{difficulty.name}</div>
                          <div className="text-xs text-gray-500">
                            {difficulty.creditReward} credits • {difficulty.intensityMultiplier}x intensity
                          </div>
                        </div>
                        {difficulty.level === currentDifficulty.level && (
                          <Zap className="w-4 h-4 text-blue-500" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Key Features */}
        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fame-Based Progression</h3>
                  <p className="text-sm text-gray-600">
                    Socialite grows in fame through workouts, unlocking new levels with increased demands
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dynamic Difficulty</h3>
                  <p className="text-sm text-gray-600">
                    Exercise intensity scales with fame level, keeping workouts challenging and engaging
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Increased Rewards</h3>
                  <p className="text-sm text-gray-600">
                    Higher fame levels provide better credit multipliers and more valuable rewards
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressiveDifficultyDemo; 