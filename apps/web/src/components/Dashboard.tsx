import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../lib/firebase';
import { useSignOut } from '../hooks/useTRPCAuth';
import { useCompleteWorkout, useCreateWorkout } from '../hooks/useTRPCWorkout';
import { ProfileEditor } from './ProfileEditor';
import { FitnessGoalCreator } from './FitnessGoalCreator';
import WorkoutTimer from './WorkoutTimer';
import SocialiteCard from './SocialiteCard';
import { StatsPage } from './StatsPage';
import Calendar from './Calendar';
import ExerciseLibrary from './ExerciseLibrary';
import { ExerciseDifficulty } from '../types/socialite';
import {
  User as UserIcon,
  Target,
  Play,
  BarChart3,
  LogOut,
  Activity,
  Calendar as CalendarIcon,
  BookOpen,
  Home
} from 'lucide-react';

interface User {
  uid: string;
  name: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  fitnessGoal?: string;
  activityLevel?: string;
  bmi?: number;
  credits?: number;
  workoutsPerWeek?: number;
}

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user: appUser, onNavigate, onSignOut }) => {
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showGoalCreator, setShowGoalCreator] = useState(false);
  const [showWorkoutTimer, setShowWorkoutTimer] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'workout' | 'stats' | 'calendar' | 'exercises'>('main');
  const [userData, setUserData] = useState<User | null>(null);

  const signOut = useSignOut();
  const createWorkout = useCreateWorkout();
  const completeWorkout = useCompleteWorkout();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Use app user data if available, otherwise create mock data
        setUserData(appUser || {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email || '',
          age: 25,
          weight: 70,
          height: 170,
          fitnessGoal: 'general-fitness',
          activityLevel: 'moderately_active',
          credits: 100,
          workoutsPerWeek: 3
        });
      }
    });

    return () => unsubscribe();
  }, [appUser]);

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
      onSignOut(); // Call the App.tsx signOut handler
    } catch (error) {
      console.error('Failed to sign out:', error);
      onSignOut(); // Still call the App.tsx signOut handler even if Firebase signOut fails
    }
  };

  const handleStartWorkout = () => {
    setShowWorkoutTimer(true);
    setCurrentView('workout');
  };

  const handleCompleteWorkout = async (credits: number, workoutMeta?: { exercises: ExerciseDifficulty[]; totalDuration: number; difficulty: number }) => {
    try {
      if (!userData?.uid || !workoutMeta) return;

      // Create workout
      const workout = await createWorkout.mutateAsync({
        userId: userData.uid,
        exercises: workoutMeta.exercises.map(ex => ({
          name: ex.name,
          sets: ex.baseSets,
          reps: typeof ex.baseReps === 'string' ? parseInt(ex.baseReps) : ex.baseReps,
          duration: ex.baseDuration,
          completed: false
        })),
        totalDuration: workoutMeta.totalDuration,
        difficulty: workoutMeta.difficulty,
        creditReward: credits,
        fameReward: Math.floor(credits * 0.5),
        experienceReward: Math.floor(credits * 0.3),
        completed: false
      });

      // Complete workout
      await completeWorkout.mutateAsync({
        id: workout.id,
        userId: userData.uid,
        earnedCredits: credits,
        earnedFame: Math.floor(credits * 0.5),
        earnedExperience: Math.floor(credits * 0.3),
      });

      // Update user credits
      setUserData(prev => prev ? { ...prev, credits: (prev.credits || 0) + credits } : null);

      setShowWorkoutTimer(false);
      setCurrentView('main');
    } catch (error) {
      console.error('Failed to complete workout:', error);
    }
  };

  const handleSocialiteAction = (action: 'feed' | 'clean' | 'play') => {
    if (!userData || (userData.credits || 0) < 10) return;
    
    const costs = { feed: 10, clean: 15, play: 5 };
    const cost = costs[action];
    
    setUserData(prev => prev ? { ...prev, credits: (prev.credits || 0) - cost } : null);
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (currentView === 'workout' && showWorkoutTimer && userData) {
    return (
      <WorkoutTimer
        user={{
          id: 1,
          name: userData.name,
          level: 1,
          fame: 100
        }}
        onComplete={handleCompleteWorkout}
        onClose={() => {
          setShowWorkoutTimer(false);
          setCurrentView('main');
        }}
      />
    );
  }

  if (currentView === 'stats') {
    return (
      <div className="min-h-screen bg-gray-50">
        <StatsPage onClose={() => setCurrentView('main')} />
      </div>
    );
  }

  if (currentView === 'calendar') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Workout Calendar</h1>
            <button
              onClick={() => setCurrentView('main')}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
          <Calendar user={userData} />
        </div>
      </div>
    );
  }

  if (currentView === 'exercises') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Exercise Library</h1>
            <button
              onClick={() => setCurrentView('main')}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
          <ExerciseLibrary />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Gym Kardioshian</h1>
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
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'calendar'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setCurrentView('exercises')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'exercises'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Exercises
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-yellow-800">Credits: {userData.credits || 0}</span>
              </div>
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
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {userData?.name || userData.email}!
            </h2>
            <p className="text-emerald-100">
              Ready to crush your fitness goals today?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <button
              onClick={() => setCurrentView('calendar')}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <CalendarIcon className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar</h3>
              <p className="text-gray-600">Plan your workouts</p>
            </button>
          </div>

          {/* Socialite Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SocialiteCard
              socialite={{
                id: 1,
                name: 'Your Socialite',
                type: 'influencer',
                age: 15,
                hunger: 85,
                hygiene: 70,
                happiness: 90,
                level: 3,
                fame: 100,
                experience: 0,
                spa: 40,
                glam: 50,
                outfits: 30,
                photoshoots: 20,
                trips: 10,
                posts: 60,
                wellness: 50,
                petcare: 70,
                events: 30,
                pr: 80,
                totalWorkouts: 0,
                totalCreditsEarned: 0,
                createdAt: new Date(),
                updatedAt: new Date()
              }}
              onFeed={() => handleSocialiteAction('feed')}
              onClean={() => handleSocialiteAction('clean')}
              onPlay={() => handleSocialiteAction('play')}
              credits={userData?.credits ?? 0}
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-600" />
              Recent Workouts
            </h3>
            <p className="text-gray-600">No workouts yet. Start your first one!</p>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showProfileEditor && userData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ProfileEditor
            user={{
              uid: userData.uid,
              name: userData.name,
              age: userData.age || 25,
              weight: userData.weight || 70,
              height: userData.height,
              fitnessGoal: userData.fitnessGoal || 'general-fitness',
              activityLevel: userData.activityLevel || 'moderately_active'
            }}
            onClose={() => setShowProfileEditor(false)}
            onSave={() => setShowProfileEditor(false)}
          />
        </div>
      )}

      {showGoalCreator && userData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <FitnessGoalCreator
            userId={userData.uid}
            onClose={() => setShowGoalCreator(false)}
            onSave={() => setShowGoalCreator(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;