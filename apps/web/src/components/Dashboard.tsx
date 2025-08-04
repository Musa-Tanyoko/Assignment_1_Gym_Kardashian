import { useState, useEffect, useMemo } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../lib/firebase'; // TODO: Explicitly type 'app' in ../lib/firebase to avoid implicit 'any' type error
import { useSignOut } from '../hooks/useTRPCAuth';
import { useCompleteWorkout, useCreateWorkout } from '../hooks/useTRPCWorkout';
import { ProfileEditor } from './ProfileEditor';
import { FitnessGoalCreator } from './FitnessGoalCreator';
import WorkoutTimer from './WorkoutTimer';
import SocialiteCard from './SocialiteCard';
import { StatsPage } from './StatsPage';
import Calendar from './Calendar';
import ExerciseLibrary from './ExerciseLibrary';
import { ExerciseDifficulty, calculateProgressiveWorkout, SocialiteStats } from '../types/socialite';
import { FitnessGoalTest } from './FitnessGoalTest';
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
  totalWorkouts?: number;
  fame?: number;
  experience?: number;
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

  // Generate progressive workout based on user data
  const progressiveWorkout = useMemo(() => {
    if (!userData) return null;
    
    const mockSocialite: SocialiteStats = {
      id: 1,
      name: 'Your Socialite',
      type: 'influencer',
      level: 1,
      age: 15,
      fame: userData.fame || 0,
      experience: userData.experience || 0,
      hunger: 85,
      hygiene: 70,
      happiness: 90,
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
      totalWorkouts: userData.totalWorkouts || 0,
      totalCreditsEarned: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const workout = calculateProgressiveWorkout(mockSocialite);
    console.log('Dashboard - Generated progressive workout:', workout);
    console.log('Dashboard - Total credit reward:', workout.creditReward);
    return workout;
  }, [userData]);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(appUser || {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email || '',
          age: 25,
          weight: 70,
          height: 170,
          fitnessGoal: 'general-fitness',
          activityLevel: 'moderately_active',
          credits: 0,
          workoutsPerWeek: 3,
          totalWorkouts: 0,
          fame: 0,
          experience: 0
        });
      }
    });

    return () => unsubscribe();
  }, [appUser]);

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
      onSignOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
      onSignOut();
    }
  };

  const handleStartWorkout = () => {
    setShowWorkoutTimer(true);
    setCurrentView('workout');
  };

  const handleCompleteWorkout = async (credits: number, workoutMeta?: { exercises: ExerciseDifficulty[]; totalDuration: number; difficulty: number }) => {
    console.log('Handle complete workout called with credits:', credits, 'meta:', workoutMeta);
    
    try {
      // Check authentication first
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        console.error('No authenticated user found');
        alert('Please log in again to complete your workout.');
        return;
      }
      
      if (!userData?.uid) {
        console.log('Dashboard - Missing userData.uid, returning early');
        return;
      }
      
      // Verify user ID matches authenticated user
      if (userData.uid !== currentUser.uid) {
        console.error('User ID mismatch:', userData.uid, 'vs', currentUser.uid);
        alert('Authentication error. Please refresh the page and try again.');
        return;
      }
      
      if (!workoutMeta) {
        console.log('Dashboard - Missing workoutMeta, using progressive workout data');
        if (!progressiveWorkout) {
          console.log('Dashboard - No progressive workout available, returning early');
          return;
        }
        // Use progressive workout data as fallback
        workoutMeta = {
          exercises: progressiveWorkout.exercises,
          totalDuration: progressiveWorkout.totalDuration,
          difficulty: progressiveWorkout.difficulty
        };
      }

      console.log('Dashboard - Creating workout...');
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
      console.log('Dashboard - Workout created:', workout);

      console.log('Dashboard - Completing workout...');
      const result = await completeWorkout.mutateAsync({
        userId: userData.uid,
        earnedCredits: credits,
        earnedFame: Math.floor(credits * 0.5),
        earnedExperience: Math.floor(credits * 0.3),
        totalDuration: workoutMeta.totalDuration,
        exercises: workoutMeta.exercises,
      });
      console.log('Mutation result:', result);

      // Update local state with the result from the mutation
      if (result && result.credits !== undefined) {
        setUserData(prev => {
          if (!prev) return null;
          const updated = { 
            ...prev, 
            credits: result.credits,
            totalWorkouts: (prev.totalWorkouts || 0) + 1,
            fame: (prev.fame || 0) + Math.floor(credits * 0.5),
            experience: (prev.experience || 0) + Math.floor(credits * 0.3)
          };
          console.log('Dashboard - Updated user data with mutation result:', updated);
          return updated;
        });
      } else {
        // Fallback: update with calculated values if mutation result is incomplete
        setUserData(prev => {
          if (!prev) return null;
          const updated = { 
            ...prev, 
            credits: (prev.credits || 0) + credits,
            totalWorkouts: (prev.totalWorkouts || 0) + 1,
            fame: (prev.fame || 0) + Math.floor(credits * 0.5),
            experience: (prev.experience || 0) + Math.floor(credits * 0.3)
          };
          console.log('Dashboard - Updated user data with fallback calculation:', updated);
          return updated;
        });
      }

      // Force refresh user data from Firebase to ensure consistency
      try {
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
          const { getUser } = await import('../lib/firebase-client');
          const refreshedUser = await getUser(user.uid);
          console.log('Dashboard - Refreshed user data from Firebase:', refreshedUser);
          setUserData(refreshedUser);
        }
      } catch (error) {
        console.error('Dashboard - Error refreshing user data:', error);
      }

      setShowWorkoutTimer(false);
      setCurrentView('main');
    } catch (error) {
      console.error('Failed to complete workout:', error);
      // Show user-friendly error message (you could add a toast notification here)
      alert('Failed to complete workout. Please try again.');
    }
  };

  const handleSocialiteAction = (action: 'feed' | 'clean' | 'play') => {
    if (!userData) return;
    
    const costs = { feed: 10, clean: 15, play: 5 };
    const cost = costs[action];
    
    if ((userData.credits || 0) >= cost) {
      setUserData(prev => prev ? { ...prev, credits: (prev.credits || 0) - cost } : null);
      // TODO: Implement socialite actions
      console.log(`Socialite action: ${action}`);
    }
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
          fame: userData.fame || 0
        }}
        progressiveWorkout={progressiveWorkout || undefined}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {userData?.name || userData.email}!
            </h2>
            <p className="text-emerald-100">
              Ready to crush your fitness goals today?
            </p>
          </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SocialiteCard
              socialite={{
                id: 1,
                name: 'Your Socialite',
                type: 'influencer',
                age: 0,
                hunger: 0,
                hygiene: 0,
                happiness: 0,
                level: 1,
                fame: userData.fame || 0,
                experience: userData.experience || 0,
                spa: 0,
                glam: 0,
                outfits: 0,
                photoshoots: 0,
                trips: 0,
                posts: 0,
                wellness: 0,
                petcare: 0,
                events: 0,
                pr: 0,
                totalWorkouts: userData.totalWorkouts || 0,
                totalCreditsEarned: 0,
                createdAt: new Date(),
                updatedAt: new Date()
              }}
              onFeed={() => handleSocialiteAction('feed')}
              onClean={() => handleSocialiteAction('clean')}
              onPlay={() => handleSocialiteAction('play')}
              credits={userData.credits || 0}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-600" />
              Recent Workouts
            </h3>
            <p className="text-gray-600">No workouts yet. Start your first one!</p>
          </div>

          <FitnessGoalTest />
        </div>
      </main>

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
            onSave={async () => {
              setShowGoalCreator(false);
              // Refresh user data after saving
              const auth = getAuth(app);
              const user = auth.currentUser;
              if (user) {
                // Force a refresh of user data
                const updatedUserData = {
                  ...userData,
                  fitnessGoal: userData.fitnessGoal
                };
                setUserData(updatedUserData);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;