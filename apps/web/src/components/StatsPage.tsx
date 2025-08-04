import { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Activity, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTRPCContext } from './TRPCProvider';
import { useGetUserStats } from '../hooks/useTRPCWorkout';
import { useGetCurrentUser } from '../hooks/useTRPCAuth';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface StatsPageProps {
  onClose: () => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({ onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Get current user
  const { data: currentUser } = useGetCurrentUser();
  
  // Fetch user stats from backend
  const { data: userStats, isLoading, isError } = useGetUserStats(currentUser?.uid || '');

  // Default stats for new users
  const defaultStats = {
    totalWorkouts: 0,
    currentStreak: 0,
    totalCalories: 0,
    averageWorkoutDuration: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    monthlyProgress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };

  // Use real stats if available, otherwise use defaults
  const stats = userStats ? {
    totalWorkouts: userStats.sessions || 0,
    currentStreak: userStats.streak || 0,
    totalCalories: userStats.totalCalories || 0,
    averageWorkoutDuration: userStats.averageWorkoutDuration || 0,
    weeklyProgress: userStats.weeklyProgress || [0, 0, 0, 0, 0, 0, 0],
    monthlyProgress: userStats.monthlyProgress || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  } : defaultStats;

  const periods = [
    { id: 'week', name: 'This Week', icon: Calendar },
    { id: 'month', name: 'This Month', icon: TrendingUp },
    { id: 'year', name: 'This Year', icon: BarChart3 },
  ];

  const getProgressData = () => {
    switch (selectedPeriod) {
      case 'week':
        return stats.weeklyProgress;
      case 'month':
        return stats.monthlyProgress.slice(0, 4); // First 4 weeks
      case 'year':
        return stats.monthlyProgress;
      default:
        return stats.weeklyProgress;
    }
  };

  const progressData = getProgressData();

  const statsCards = [
    {
      title: 'Total Workouts',
      value: stats.totalWorkouts,
      icon: Activity,
      gradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-900',
      labelColor: 'text-blue-600'
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: TrendingUp,
      gradient: 'from-green-50 to-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-900',
      labelColor: 'text-green-600'
    },
    {
      title: 'Calories Burned',
      value: stats.totalCalories.toLocaleString(),
      icon: Target,
      gradient: 'from-orange-50 to-orange-100',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-900',
      labelColor: 'text-orange-600'
    },
    {
      title: 'Avg Duration',
      value: `${stats.averageWorkoutDuration} min`,
      icon: Calendar,
      gradient: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      valueColor: 'text-purple-900',
      labelColor: 'text-purple-600'
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Your Fitness Stats
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your stats...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Error state
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Your Fitness Stats
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-600 mb-2">Error loading stats</p>
                <p className="text-gray-600">Please try again later.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // New user state (no workouts completed)
  if (stats.totalWorkouts === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Your Fitness Stats
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No workout data yet!</h3>
                <p className="text-gray-600 mb-6">
                  Complete your first workout to start tracking your fitness journey and see your progress here.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-gray-400">0</p>
                    <p className="text-sm text-gray-600">Workouts</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-gray-400">0</p>
                    <p className="text-sm text-gray-600">Day Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Your Fitness Stats
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Period Selector */}
          <motion.div 
            className="flex space-x-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {periods.map((period, index) => {
              const Icon = period.icon;
              return (
                <motion.div
                  key={period.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedPeriod === period.id ? "default" : "outline"}
                    onClick={() => setSelectedPeriod(period.id)}
                    className="flex items-center"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {period.name}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${stat.labelColor}`}>{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                  </div>
                  <motion.div
                    className={stat.iconColor}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <stat.icon className="w-8 h-8" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Chart */}
          <motion.div 
            className="bg-gray-50 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Over Time</h3>
            <div className="flex items-end space-x-2 h-32">
              {progressData.map((value, index) => (
                <motion.div 
                  key={index} 
                  className="flex-1 flex flex-col items-center"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                >
                  <motion.div
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t"
                    style={{ height: `${value}%` }}
                    whileHover={{ scaleY: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="text-xs text-gray-600 mt-2">
                    {selectedPeriod === 'week' ? `D${index + 1}` : 
                     selectedPeriod === 'month' ? `W${index + 1}` : 
                     `M${index + 1}`}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>0%</span>
              <span>100%</span>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {stats.totalWorkouts > 0 ? (
                // Show recent workouts if available
                [1, 2, 3].map((i, index) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="w-3 h-3 bg-green-500 rounded-full mr-4"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    />
                                         <div className="flex-1">
                       <p className="font-medium text-gray-800">Workout #{stats.totalWorkouts - i + 1}</p>
                       <p className="text-sm text-gray-600">{stats.averageWorkoutDuration} minutes • {stats.totalWorkouts > 0 ? Math.round(stats.totalCalories / stats.totalWorkouts) : 0} calories</p>
                     </div>
                    <Badge variant="outline" className="text-sm">
                      {i} day{i > 1 ? 's' : ''} ago
                    </Badge>
                  </motion.div>
                ))
              ) : (
                // Show empty state for recent activity
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activity to display</p>
                </div>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
