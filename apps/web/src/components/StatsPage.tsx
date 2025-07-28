import { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Activity, X } from 'lucide-react';
import { useTRPCContext } from './TRPCProvider';

interface StatsPageProps {
  onClose: () => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({ onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Mock data for demonstration - in a real app, you'd fetch this from your API
  const mockStats = {
    totalWorkouts: 24,
    currentStreak: 7,
    totalCalories: 12450,
    averageWorkoutDuration: 45,
    weeklyProgress: [65, 72, 68, 75, 80, 78, 85],
    monthlyProgress: [60, 65, 70, 75, 80, 85, 90, 95, 100, 95, 90, 85],
  };

  const periods = [
    { id: 'week', name: 'This Week', icon: Calendar },
    { id: 'month', name: 'This Month', icon: TrendingUp },
    { id: 'year', name: 'This Year', icon: BarChart3 },
  ];

  const getProgressData = () => {
    switch (selectedPeriod) {
      case 'week':
        return mockStats.weeklyProgress;
      case 'month':
        return mockStats.monthlyProgress.slice(0, 4); // First 4 weeks
      case 'year':
        return mockStats.monthlyProgress;
      default:
        return mockStats.weeklyProgress;
    }
  };

  const progressData = getProgressData();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2" />
          Your Fitness Stats
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2 mb-6">
        {periods.map((period) => {
          const Icon = period.icon;
          return (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                selectedPeriod === period.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {period.name}
            </button>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Workouts</p>
              <p className="text-3xl font-bold text-blue-900">{mockStats.totalWorkouts}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Current Streak</p>
              <p className="text-3xl font-bold text-green-900">{mockStats.currentStreak} days</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Calories Burned</p>
              <p className="text-3xl font-bold text-orange-900">{mockStats.totalCalories.toLocaleString()}</p>
            </div>
            <Target className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Duration</p>
              <p className="text-3xl font-bold text-purple-900">{mockStats.averageWorkoutDuration} min</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Over Time</h3>
        <div className="flex items-end space-x-2 h-32">
          {progressData.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                style={{ height: `${value}%` }}
              />
              <span className="text-xs text-gray-600 mt-2">
                {selectedPeriod === 'week' ? `D${index + 1}` : 
                 selectedPeriod === 'month' ? `W${index + 1}` : 
                 `M${index + 1}`}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-4" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Workout #{24 - i}</p>
                <p className="text-sm text-gray-600">45 minutes • 350 calories</p>
              </div>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
