// import React from 'react';
import { Clock, Target, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const ExerciseLibrary = () => {
  const exercises = [
    {
      id: 1,
      name: 'Push-ups',
      category: 'Upper Body',
      duration: '45s',
      difficulty: 'Beginner',
      calories: '8-12',
      description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
      instructions: [
        'Start in plank position with hands shoulder-width apart',
        'Lower your body until chest nearly touches the floor',
        'Push back up to starting position',
        'Keep your body straight throughout the movement'
      ],
      image: '🏋️‍♀️',
      tips: 'Keep your core engaged and maintain a straight line from head to heels'
    },
    {
      id: 2,
      name: 'Squats',
      category: 'Lower Body',
      duration: '50s',
      difficulty: 'Beginner',
      calories: '10-15',
      description: 'Perfect for building glutes, quads, and overall lower body strength',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower your hips back and down as if sitting in a chair',
        'Keep your chest up and knees behind your toes',
        'Push through your heels to return to standing'
      ],
      image: '🍑',
      tips: 'Imagine sitting back into an invisible chair for proper form'
    },
    {
      id: 3,
      name: 'Plank',
      category: 'Core',
      duration: '30s',
      difficulty: 'Intermediate',
      calories: '5-8',
      description: 'Isometric core exercise that builds stability and strength',
      instructions: [
        'Start in push-up position',
        'Lower onto your forearms',
        'Keep your body in a straight line',
        'Hold the position while breathing normally'
      ],
      image: '⚖️',
      tips: 'Focus on keeping your hips level and core tight'
    },
    {
      id: 4,
      name: 'Burpees',
      category: 'Full Body',
      duration: '60s',
      difficulty: 'Advanced',
      calories: '15-20',
      description: 'High-intensity full-body exercise for maximum calorie burn',
      instructions: [
        'Start standing, then squat down',
        'Jump back into plank position',
        'Do a push-up (optional)',
        'Jump feet back to squat, then jump up with arms overhead'
      ],
      image: '🔥',
      tips: 'Modify by stepping back instead of jumping for lower impact'
    },
    {
      id: 5,
      name: 'Lunges',
      category: 'Lower Body',
      duration: '45s',
      difficulty: 'Beginner',
      calories: '8-12',
      description: 'Unilateral leg exercise for balance and strength',
      instructions: [
        'Step forward with one leg',
        'Lower your hips until both knees are at 90 degrees',
        'Push back to starting position',
        'Alternate legs or complete one side first'
      ],
      image: '👑',
      tips: 'Keep your front knee over your ankle, not pushed out past your toes'
    },
    {
      id: 6,
      name: 'Mountain Climbers',
      category: 'Cardio',
      duration: '40s',
      difficulty: 'Intermediate',
      calories: '12-18',
      description: 'Dynamic cardio exercise that targets core and improves endurance',
      instructions: [
        'Start in plank position',
        'Bring one knee toward your chest',
        'Quickly switch legs',
        'Continue alternating at a rapid pace'
      ],
      image: '⛰️',
      tips: 'Keep your hips level and maintain plank position throughout'
    },
    {
      id: 7,
      name: 'Jumping Jacks',
      category: 'Cardio',
      duration: '45s',
      difficulty: 'Beginner',
      calories: '10-15',
      description: 'Classic cardio warm-up exercise to get your heart pumping',
      instructions: [
        'Start with feet together, arms at sides',
        'Jump while spreading legs shoulder-width apart',
        'Simultaneously raise arms overhead',
        'Jump back to starting position'
      ],
      image: '💃',
      tips: 'Land softly on the balls of your feet to reduce impact'
    },
    {
      id: 8,
      name: 'High Knees',
      category: 'Cardio',
      duration: '30s',
      difficulty: 'Beginner',
      calories: '8-12',
      description: 'Running in place with high knee lifts for cardio and coordination',
      instructions: [
        'Stand with feet hip-width apart',
        'Run in place lifting knees to hip level',
        'Pump your arms naturally',
        'Maintain quick, light steps'
      ],
      image: '🦵',
      tips: 'Focus on lifting knees high rather than speed'
    }
  ];

  type Difficulty =
    | 'Beginner'
    | 'Intermediate'
    | 'Advanced';

  const getDifficultyVariant = (difficulty: Difficulty | string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'destructive';
      default: return 'default';
    }
  };

  const getCategoryVariant = (category: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
    switch (category) {
      case 'Upper Body': return 'info';
      case 'Lower Body': return 'secondary';
      case 'Core': return 'success';
      case 'Cardio': return 'warning';
      case 'Full Body': return 'default';
      default: return 'default';
    }
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
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="text-center mb-8"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Exercise Library</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Master these fabulous exercises to keep your pets happy and your body goals on track
        </p>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <motion.div 
                  className="text-center mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-4xl mb-2">{exercise.image}</div>
                  <CardTitle className="text-xl">{exercise.name}</CardTitle>
                </motion.div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={getCategoryVariant(exercise.category)}>
                    {exercise.category}
                  </Badge>
                  <Badge variant={getDifficultyVariant(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">{exercise.duration}</div>
                  </div>
                  <div className="text-center">
                    <Zap className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">{exercise.calories} cal</div>
                  </div>
                  <div className="text-center">
                    <Target className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Targeted</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Instructions:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {exercise.instructions.slice(0, 2).map((instruction, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="w-1 h-1 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {instruction}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.div 
                  className="mt-4 p-3 bg-emerald-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start">
                    <Heart className="w-4 h-4 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-xs text-emerald-800">{exercise.tips}</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ExerciseLibrary;