import { useState } from 'react';
import { Target, Activity, X, Plus, TrendingUp, Heart, Zap } from 'lucide-react';
import { trpc } from '../lib/trpc/client';
import { getAuth } from 'firebase/auth';

interface FitnessGoalCreatorProps {
  onClose: () => void;
  onGoalSet: () => void;
}

const fitnessGoals = [
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    icon: TrendingUp,
    description: 'Shed pounds and improve body composition',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    id: 'muscle-gain',
    name: 'Muscle Gain',
    icon: Zap,
    description: 'Build strength and increase muscle mass',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'endurance',
    name: 'Endurance',
    icon: Heart,
    description: 'Improve cardiovascular fitness and stamina',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    id: 'flexibility',
    name: 'Flexibility',
    icon: Activity,
    description: 'Enhance mobility and range of motion',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'general-fitness',
    name: 'General Fitness',
    icon: Target,
    description: 'Overall health and wellness improvement',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
];

export const FitnessGoalCreator: React.FC<FitnessGoalCreatorProps> = ({ onClose, onGoalSet }) => {
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const trpcClient = trpc.user.setFitnessGoal.useMutation();

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const handleSetGoal = async () => {
    if (!selectedGoal) return;

    setIsLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      await trpcClient.mutateAsync({
        uid: user.uid,
        fitnessGoal: selectedGoal,
      });

      onGoalSet();
      onClose();
    } catch (error) {
      console.error('Failed to set fitness goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Target className="w-6 h-6 mr-2 text-emerald-600" />
              Choose Your Fitness Goal
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Select a primary fitness goal to personalize your workout recommendations
          </p>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {fitnessGoals.map((goal) => {
              const Icon = goal.icon;
              return (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedGoal === goal.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${goal.bgColor}`}>
                      <Icon className={`w-6 h-6 ${goal.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    </div>
                    {selectedGoal === goal.id && (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white transform rotate-45" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSetGoal}
              disabled={!selectedGoal || isLoading}
              className="flex items-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting Goal...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Set Goal
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};