import { trpc } from '../lib/trpc/client';
import { getAuth } from 'firebase/auth';
import { Calendar, Target, TrendingUp, Award, Clock, Flame } from 'lucide-react';

export const StatsPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  // Use the new tRPC client directly
  const { data: userStats, isLoading } = trpc.user.getById.useQuery(
    { uid: user?.uid || '' },
    { enabled: !!user?.uid }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No stats available</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Workouts',
      value: userStats.totalWorkouts || 0,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Current Streak',
      value: userStats.currentStreak || 0,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Credits Earned',
      value: userStats.totalCreditsEarned || 0,
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Average Duration',
      value: `${userStats.averageWorkoutDuration || 0} min`,
      icon: Clock,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Fitness Stats</h1>
          <p className="text-gray-600">Track your progress and achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
            Progress Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Fitness Goal</h3>
              <p className="text-gray-600 capitalize">
                {userStats.fitnessGoal?.replace('-', ' ') || 'Not set'}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Activity Level</h3>
              <p className="text-gray-600 capitalize">
                {userStats.activityLevel?.replace('_', ' ') || 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
