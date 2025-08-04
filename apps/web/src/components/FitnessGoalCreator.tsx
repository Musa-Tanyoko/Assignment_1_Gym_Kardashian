import { useState } from 'react';
import { Target, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTRPCContext } from './TRPCProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface FitnessGoalCreatorProps {
  userId: string;
  onClose: () => void;
  onSave: () => void;
}

export const FitnessGoalCreator: React.FC<FitnessGoalCreatorProps> = ({ userId, onClose, onSave }) => {
  const [fitnessGoal, setFitnessGoal] = useState('general-fitness');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const trpcClient = useTRPCContext();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Saving fitness goal:', { uid: userId, fitnessGoal });
      const result = await trpcClient.user.setFitnessGoal({
        uid: userId,
        fitnessGoal: fitnessGoal,
      });
      console.log('Fitness goal saved successfully:', result);
      onSave();
    } catch (err) {
      console.error('Failed to set fitness goal:', err);
      setError('Failed to set fitness goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fitnessGoals = [
    {
      value: 'weight-loss',
      label: 'Weight Loss',
      description: 'Focus on burning calories and reducing body fat',
      icon: '⚖️',
      color: 'success' as const
    },
    {
      value: 'muscle-gain',
      label: 'Muscle Gain',
      description: 'Build strength and increase muscle mass',
      icon: '💪',
      color: 'warning' as const
    },
    {
      value: 'endurance',
      label: 'Endurance',
      description: 'Improve cardiovascular fitness and stamina',
      icon: '🏃‍♀️',
      color: 'info' as const
    },
    {
      value: 'flexibility',
      label: 'Flexibility',
      description: 'Enhance mobility and range of motion',
      icon: '🧘‍♀️',
      color: 'secondary' as const
    },
    {
      value: 'general-fitness',
      label: 'General Fitness',
      description: 'Maintain overall health and wellness',
      icon: '🌟',
      color: 'default' as const
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Set Fitness Goal
            </CardTitle>
            <div className="flex space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What's your primary fitness goal?
              </label>
              
              <div className="space-y-3">
                {fitnessGoals.map((goal, index) => (
                  <motion.div
                    key={goal.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="fitnessGoal"
                        value={goal.value}
                        checked={fitnessGoal === goal.value}
                        onChange={(e) => setFitnessGoal(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center ${
                        fitnessGoal === goal.value 
                          ? 'border-emerald-500 bg-emerald-500' 
                          : 'border-gray-300'
                      }`}>
                        {fitnessGoal === goal.value && (
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{goal.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{goal.label}</div>
                            <div className="text-sm text-gray-600">{goal.description}</div>
                          </div>
                        </div>
                      </div>
                      {fitnessGoal === goal.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant={goal.color}>Selected</Badge>
                        </motion.div>
                      )}
                    </label>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p>This will help us personalize your workout recommendations and track your progress effectively.</p>
            </motion.div>
          </motion.div>

          {error && (
            <motion.div 
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};