import { useState } from 'react';
import { User, Calendar, Target, Activity, Save, X, Edit3, Weight, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTRPCContext } from './TRPCProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProfileEditorProps {
  user: {
    uid: string;
    name: string;
    age: number;
    weight: number;
    height?: number;
    fitnessGoal: string;
    activityLevel: string;
  };
  onClose: () => void;
  onSave: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age,
    weight: user.weight,
    height: user.height || 0,
    fitnessGoal: user.fitnessGoal,
    activityLevel: user.activityLevel,
  });

  const trpcClient = useTRPCContext();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await trpcClient.user.update({
        uid: user.uid,
        updates: formData,
      });
      setIsEditing(false);
      onSave();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      age: user.age,
      weight: user.weight,
      height: user.height || 0,
      fitnessGoal: user.fitnessGoal,
      activityLevel: user.activityLevel,
    });
    setIsEditing(false);
    setError(null);
  };

  const getFitnessGoalColor = (goal: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      'weight-loss': 'success',
      'muscle-gain': 'warning',
      'endurance': 'info',
      'flexibility': 'secondary',
      'general-fitness': 'default'
    };
    return colors[goal] || 'default';
  };

  const getActivityLevelColor = (level: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      'sedentary': 'destructive',
      'lightly_active': 'warning',
      'moderately_active': 'info',
      'very_active': 'success',
      'extremely_active': 'default'
    };
    return colors[level] || 'default';
  };

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
              <User className="w-6 h-6 mr-2" />
              Profile
            </CardTitle>
            <div className="flex space-x-2">
              {!isEditing ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-5 h-5" />
                  </Button>
                </motion.div>
              ) : (
                <>
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
                      onClick={handleCancel}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </>
              )}
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
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <User className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.name}</p>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.age} years</p>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Weight className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.weight} kg</p>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Ruler className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.height || 'Not set'} cm</p>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Target className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fitness Goal
                </label>
                {isEditing ? (
                  <select
                    value={formData.fitnessGoal}
                    onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="general-fitness">General Fitness</option>
                  </select>
                ) : (
                  <Badge variant={getFitnessGoalColor(user.fitnessGoal)}>
                    {user.fitnessGoal.replace('-', ' ')}
                  </Badge>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Activity className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                </label>
                {isEditing ? (
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly_active">Lightly Active</option>
                    <option value="moderately_active">Moderately Active</option>
                    <option value="very_active">Very Active</option>
                    <option value="extremely_active">Extremely Active</option>
                  </select>
                ) : (
                  <Badge variant={getActivityLevelColor(user.activityLevel)}>
                    {user.activityLevel.replace('_', ' ')}
                  </Badge>
                )}
              </div>
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