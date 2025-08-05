import { useState, useEffect } from 'react';
import { Target, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTRPCContext } from './TRPCProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useUpdateUser } from '../hooks/useTRPCAuth'; // Import useUpdateUser

interface FitnessGoalCreatorProps {
  userId: string;
  currentFitnessGoal?: string; // Add this prop
  onClose: () => void;
  onSave: () => void;
}

export const FitnessGoalCreator: React.FC<FitnessGoalCreatorProps> = ({ userId, currentFitnessGoal, onClose, onSave }) => {
  const [fitnessGoal, setFitnessGoal] = useState(currentFitnessGoal || 'general-fitness');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const trpcClient = useTRPCContext();
  const updateUser = useUpdateUser(); // Initialize the hook

  // Update local state if currentFitnessGoal prop changes (e.g., after user profile refresh)
  useEffect(() => {
    if (currentFitnessGoal && currentFitnessGoal !== fitnessGoal) {
      setFitnessGoal(currentFitnessGoal);
    }
  }, [currentFitnessGoal]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Saving fitness goal:', { uid: userId, fitnessGoal });
      
      // Use the updateUser mutation to update the fitnessGoal
      await updateUser.mutateAsync({
        uid: userId,
        updates: { fitnessGoal: fitnessGoal },
      });
      
      console.log('Fitness goal saved successfully.');
      onSave(); // Call onSave to close the modal and potentially refresh parent data
    } catch (err: any) {
      console.error('Failed to set fitness goal:', err);
      setError(`Failed to set fitness goal: ${err.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fitnessGoals = [
    {
      value: 'general-fitness',
      label: 'General Fitness',
      description: 'Improve overall health and well-being.',
      icon: Target,
      color: 'default' as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'info' | 'warning',
    },
    {
      value: 'weight-loss',
      label: 'Weight Loss',
      description: 'Focus on shedding extra pounds through calorie deficit and cardio.',
      icon: X,
      color: 'destructive' as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'info' | 'warning',
    },
    {
      value: 'muscle-gain',
      label: 'Muscle Gain',
      description: 'Build strength and muscle mass with resistance training.',
      icon: Save,
      color: 'secondary' as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'info' | 'warning',
    },
    {
      value: 'endurance',
      label: 'Endurance',
      description: 'Increase stamina and cardiovascular health for longer activities.',
      icon: Target, // Reusing Target, consider a running icon if available
      color: 'info' as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'info' | 'warning',
    },
    {
      value: 'flexibility',
      label: 'Flexibility',
      description: 'Improve range of motion and reduce risk of injury.',
      icon: Target, // Reusing Target, consider a stretch icon if available
      color: 'warning' as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'info' | 'warning',
    },
  ];

  return (
    <Card className="w-full max-w-lg bg-gray-800 text-white border border-gray-700 shadow-xl rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-700">
        <CardTitle className="text-2xl font-bold text-purple-400 flex items-center">
          <Target className="w-6 h-6 mr-2" /> Set Your Fitness Goal
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Choose your primary goal:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fitnessGoals.map((goal) => (
                <motion.div
                  key={goal.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200
                    ${fitnessGoal === goal.value
                      ? 'border-purple-500 bg-purple-900/30 shadow-md'
                      : 'border-gray-600 bg-gray-700/50 hover:border-purple-400'
                    }`}
                >
                  <label className="flex items-center justify-between w-full h-full cursor-pointer">
                    <input
                      type="radio"
                      name="fitnessGoal"
                      value={goal.value}
                      checked={fitnessGoal === goal.value}
                      onChange={(e) => setFitnessGoal(e.target.value)}
                      className="sr-only" // Hide native radio button
                    />
                    <div className="flex items-center">
                      <goal.icon className="w-6 h-6 mr-3 text-purple-300" />
                      <div>
                        <p className="font-semibold text-gray-100">{goal.label}</p>
                        <div className="text-sm text-gray-400">{goal.description}</div>
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
            className="text-sm text-gray-400 bg-gray-700 p-3 rounded-lg border border-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p>This will help us personalize your workout recommendations and track your progress effectively.</p>
          </motion.div>
        </motion.div>

        {error && (
          <motion.div 
            className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="text-gray-300 border-gray-600 hover:bg-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
            {isLoading ? 'Saving...' : 'Save Goal'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
