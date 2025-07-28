import { useState } from 'react';
import { Target, Save, X } from 'lucide-react';
import { useTRPCContext } from './TRPCProvider';

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
      await trpcClient.user.update({
        uid: userId,
        updates: { fitnessGoal },
      });
      onSave();
    } catch (err) {
      console.error('Failed to set fitness goal:', err);
      setError('Failed to set fitness goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Target className="w-6 h-6 mr-2" />
          Set Fitness Goal
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your primary fitness goal?
          </label>
          <select
            value={fitnessGoal}
            onChange={(e) => setFitnessGoal(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="weight-loss">Weight Loss</option>
            <option value="muscle-gain">Muscle Gain</option>
            <option value="endurance">Endurance</option>
            <option value="flexibility">Flexibility</option>
            <option value="general-fitness">General Fitness</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          <p>This will help us personalize your workout recommendations and track your progress effectively.</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};