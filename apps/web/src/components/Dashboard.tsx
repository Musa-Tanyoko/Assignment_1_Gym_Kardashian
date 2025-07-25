import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '../lib/firebase';
import { trpcClient } from '../lib/trpc/client';
import { useSignOut } from '../hooks/useTRPCAuth';
import { useCompleteWorkout, useCreateWorkout } from '../hooks/useTRPCWorkout';
import { ProfileEditor } from './ProfileEditor';
import { FitnessGoalCreator } from './FitnessGoalCreator';
import WorkoutTimer from './WorkoutTimer';
import SocialiteCard from './SocialiteCard';

import { 
  User as UserIcon, 
  Target, 
  Play, 
  BarChart3, 
  LogOut,
  Trophy,
  Activity
} from 'lucide-react';

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showGoalCreator, setShowGoalCreator] = useState(false);
  const [showWorkoutTimer, setShowWorkoutTimer] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'workout' | 'stats'>('main');

  const signOut = useSignOut();
  const createWorkout = useCreateWorkout();
  const completeWorkout = useCompleteWorkout();

  // Get user data using tRPC
  const { data: userData } = trpcClient.user.getById.useQuery(
    { uid: user?.uid || '' },
    { enabled: !!user?.uid }
  );

  // Get socialite data
  const { data: socialiteData } = trpcClient.socialite.getByUserId.useQuery(
    { userId: user?.uid || '' },
    { enabled: !!user?.uid }
  );

  // Get workouts
  const { data: workouts } = trpcClient.workout.getByUserId.useQuery(
    { userId: user?.uid || '' },
    { enabled: !!user?.uid }
  );

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleStartWorkout = () => {
    setShowWorkoutTimer(true);
    setCurrentView('workout');
  };

  const handleCompleteWorkout = async (workoutData: any) => {
    try {
      if (!user?.uid) return;

      // Create workout
      const workout = await createWorkout.mutateAsync({
        userId: user.uid,
        exercises: workoutData.exercises,
        totalDuration: workoutData.duration,
        difficulty: workoutData.difficulty,
        creditReward: workoutData.creditReward,
        fameReward: workoutData.fameReward,
        experienceReward: workoutData.experienceReward,
      });

      // Complete workout
      await completeWorkout.mutateAsync({
        id: workout.id,
        earnedCredits: workoutData.creditReward,
        earnedFame: workoutData.fameReward,
        earnedExperience: workoutData.experienceReward,
      });

      setShowWorkoutTimer(false);
      setCurrentView('main');
    } catch (error) {
      console.error('Failed to complete workout:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (currentView === 'workout' && showWorkoutTimer && userData) {
    return (
      <WorkoutTimer
        user={userData}
        onComplete={handleCompleteWorkout}
        onClose={() => {
          setShowWorkoutTimer(false);
          setCurrentView('main');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Fitness App</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('main')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'main'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('stats')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'stats'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Stats
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfileEditor(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'main' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {userData?.name || user.email}!
              </h2>
              <p className="text-emerald-100">
                Ready to crush your fitness goals today?
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={handleStartWorkout}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <Play className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Workout</h3>
                <p className="text-gray-600">Begin your fitness session</p>
              </button>

              <button
                onClick={() => setShowGoalCreator(true)}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <Target className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Goals</h3>
                <p className="text-gray-600">Define your fitness objectives</p>
              </button>

              <button
                onClick={() => setCurrentView('stats')}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">View Stats</h3>
                <p className="text-gray-600">Track your progress</p>
              </button>
            </div>

            {/* Socialite and Pet Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {socialiteData && (
                <SocialiteCard
                  socialite={socialiteData}
                  onFeed={() => {}}
                  onClean={() => {}}
                  onPlay={() => {}}
                  credits={userData?.credits ?? 0}
                />
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-emerald-600" />
                Recent Workouts
              </h3>
              {workouts && workouts.length > 0 ? (
                <div className="space-y-3">
                  {workouts.slice(0, 5).map((workout: any) => (
                    <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {workout.exercises?.length || 0} exercises
                        </p>
                        <p className="text-sm text-gray-600">
                          {workout.totalDuration} minutes • {workout.difficulty}/10 difficulty
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {workout.completed && (
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(workout.createdAt?.toDate?.() || workout.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No workouts yet. Start your first one!</p>
              )}
            </div>
          </div>
        )}

        {currentView === 'stats' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Statistics</h2>
            <p className="text-gray-600">Stats view coming soon...</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {showProfileEditor && userData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ProfileEditor
            user={userData}
            onClose={() => setShowProfileEditor(false)}
            onSave={() => setShowProfileEditor(false)}
          />
        </div>
      )}

      {showGoalCreator && (
        <FitnessGoalCreator
          onClose={() => setShowGoalCreator(false)}
          onGoalSet={() => setShowGoalCreator(false)}
        />
      )}
    </div>
  );
};