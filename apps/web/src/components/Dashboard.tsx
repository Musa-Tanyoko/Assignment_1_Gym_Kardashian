import { useState, useEffect } from 'react';
import SocialiteCard from './PetCard';
import WorkoutTimer from './WorkoutTimer';
import Calendar from './Calendar';
import ExerciseLibrary from './ExerciseLibrary';
import { 
  Coins, 
  Trophy, 
  Calendar as CalendarIcon, 
  Play, 
  Target,
  Settings,
  Activity,
  Heart,
  TrendingUp,
  Star
} from 'lucide-react';
import { useProgressiveDifficulty } from '../hooks/useProgressiveDifficulty';
import { SocialiteStats, getCurrentFameLevel } from '../types/socialite';

interface DashboardProps {
  user: {
    credits?: number;
    name?: string;
    age?: number;
    bmi?: number;
    fitnessGoal?: string;
    activityLevel?: string;
  };
  onNavigate: (route: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('socialite');
  const [socialite, setSocialite] = useState<SocialiteStats>({
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
  });
  const [credits, setCredits] = useState(user?.credits || 150);
  const [showWorkout, setShowWorkout] = useState(false);

  // Progressive difficulty system
  const {
    socialite: progressiveSocialite,
    currentFameLevel,
    nextFameLevel,
    currentDifficulty,
    updateSocialite,
    completeWorkout: completeProgressiveWorkout,
    generateWorkout,
    canLevelUp,
    getLevelProgress,
    getAvailableDifficulties,
    getStatusSummary
  } = useProgressiveDifficulty({
    initialSocialite: socialite,
    onLevelUp: (newLevel) => {
      console.log(`🎉 ${socialite.name} leveled up to ${newLevel.name}!`);
      // You could show a notification here
    },
    onNeedsUpdate: (updatedNeeds) => {
      // Update the socialite state when needs change
      setSocialite(prev => ({ ...prev, ...updatedNeeds }));
    }
  });

  // Update local socialite state when progressive system updates it
  useEffect(() => {
    setSocialite(progressiveSocialite);
  }, [progressiveSocialite]);

  // Socialite needs actions
  const spaDay = () => { if (credits >= 20) { updateSocialite({ spa: Math.min(100, socialite.spa + 30) }); setCredits((c: number) => c - 20); } };
  const glamTeam = () => { if (credits >= 15) { updateSocialite({ glam: Math.min(100, socialite.glam + 25) }); setCredits((c: number) => c - 15); } };
  const designerOutfit = () => { if (credits >= 25) { updateSocialite({ outfits: Math.min(100, socialite.outfits + 40) }); setCredits((c: number) => c - 25); } };
  const photoshoot = () => { if (credits >= 10) { updateSocialite({ photoshoots: Math.min(100, socialite.photoshoots + 20), fame: socialite.fame + 10 }); setCredits((c: number) => c - 10); } };
  const jetSetTrip = () => { if (credits >= 30) { updateSocialite({ trips: Math.min(100, socialite.trips + 50), fame: socialite.fame + 20 }); setCredits((c: number) => c - 30); } };
  const socialPost = () => { if (credits >= 5) { updateSocialite({ posts: Math.min(100, socialite.posts + 10), fame: socialite.fame + 5 }); setCredits((c: number) => c - 5); } };
  const wellnessRitual = () => { if (credits >= 10) { updateSocialite({ wellness: Math.min(100, socialite.wellness + 20) }); setCredits((c: number) => c - 10); } };
  const petCare = () => { if (credits >= 8) { updateSocialite({ petcare: Math.min(100, socialite.petcare + 15) }); setCredits((c: number) => c - 8); } };
  const eventRedCarpet = () => { if (credits >= 40) { updateSocialite({ events: Math.min(100, socialite.events + 60), fame: socialite.fame + 30 }); setCredits((c: number) => c - 40); } };
  const prPublicist = () => { if (credits >= 12) { updateSocialite({ pr: Math.min(100, socialite.pr + 20) }); setCredits((c: number) => c - 12); } };

  const completeWorkout = (earnedCredits: number) => {
    setCredits(credits + earnedCredits);
    setShowWorkout(false);
  };

  // Removed pets interval logic, no longer needed

  const renderTabContent = () => {
    switch (activeTab) {
      case 'socialite':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Socialite</h2>
            <SocialiteCard
              socialite={socialite}
              credits={credits}
              onFeed={() => {}}
              onClean={() => {}}
              onPlay={() => {}}
            />
            <div className="space-y-2 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={spaDay} disabled={credits < 20} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">Spa Day <span className="ml-auto text-xs">20c</span></button>
                <button onClick={glamTeam} disabled={credits < 15} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">Glam Team <span className="ml-auto text-xs">15c</span></button>
                <button onClick={designerOutfit} disabled={credits < 25} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">Designer Outfit <span className="ml-auto text-xs">25c</span></button>
                <button onClick={photoshoot} disabled={credits < 10} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">Photoshoot <span className="ml-auto text-xs">10c</span></button>
                <button onClick={jetSetTrip} disabled={credits < 30} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">Jet-Set Trip <span className="ml-auto text-xs">30c</span></button>
                <button onClick={socialPost} disabled={credits < 5} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">Social Post <span className="ml-auto text-xs">5c</span></button>
                <button onClick={wellnessRitual} disabled={credits < 10} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">Wellness Ritual <span className="ml-auto text-xs">10c</span></button>
                <button onClick={petCare} disabled={credits < 8} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">Pet Care <span className="ml-auto text-xs">8c</span></button>
                <button onClick={eventRedCarpet} disabled={credits < 40} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">Red Carpet Event <span className="ml-auto text-xs">40c</span></button>
                <button onClick={prPublicist} disabled={credits < 12} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors">PR & Publicist <span className="ml-auto text-xs">12c</span></button>
              </div>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-pink-100 rounded-lg p-2 text-pink-700">Fame: {socialite.fame}</div>
                <div className="bg-pink-100 rounded-lg p-2 text-pink-700">Level: {socialite.level}</div>
              </div>
              
              {/* Progressive Difficulty Status */}
              <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
                  Progressive Difficulty Status
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Fame Level:</span>
                    <span className="font-medium text-gray-900">{currentFameLevel.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Exercise Difficulty:</span>
                    <span className="font-medium text-gray-900">{currentDifficulty.name}</span>
                  </div>
                  
                  {nextFameLevel && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Next Level:</span>
                        <span className="font-medium text-gray-900">{nextFameLevel.name}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getLevelProgress().percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        {Math.round(getLevelProgress().percentage)}% to next level
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-50 rounded p-2">
                      <div className="flex items-center">
                        <Target className="w-3 h-3 text-blue-500 mr-1" />
                        <span className="text-blue-700">Workouts: {socialite.totalWorkouts}</span>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded p-2">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-green-700">XP: {socialite.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'workout':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Progressive Workout</h2>
              <button
                onClick={() => setShowWorkout(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Workout
              </button>
            </div>

            {showWorkout ? (
              <WorkoutTimer
                user={user}
                onComplete={(earnedCredits) => {
                  // Generate a progressive workout and complete it
                  const workout = generateWorkout();
                  const actualCredits = completeProgressiveWorkout(workout);
                  completeWorkout(actualCredits);
                }}
                onClose={() => setShowWorkout(false)}
                progressiveWorkout={generateWorkout()}
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Progressive Workout</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty Level:</span>
                      <span className="font-medium">{currentDifficulty.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Intensity:</span>
                      <span className="font-medium">{currentDifficulty.intensityMultiplier}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fame Level:</span>
                      <span className="font-medium">{currentFameLevel.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-medium text-emerald-600">{currentDifficulty.creditReward * currentFameLevel.creditMultiplier}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Exercises</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Push-ups</span>
                      <span className="text-sm text-gray-500">3x12</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Squats</span>
                      <span className="text-sm text-gray-500">3x15</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Plank</span>
                      <span className="text-sm text-gray-500">3x30s</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Burpees</span>
                      <span className="text-sm text-gray-500">2x8</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Workout Calendar</h2>
            <Calendar user={user} />
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile & Stats</h2>
            <ExerciseLibrary />
          </div>
        );

      case 'exercises':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Exercise Library</h2>
            <ExerciseLibrary />
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Stats</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{user?.name || 'User'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{user?.age || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">BMI:</span>
                    <span className="font-medium">{user?.bmi || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal:</span>
                    <span className="font-medium capitalize">{user?.fitnessGoal?.replace('-', ' ') || 'General Fitness'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center">
                      <Trophy className="w-5 h-5 text-emerald-600 mr-2" />
                      <span className="text-emerald-800">First Workout</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-blue-800">Pet Adopted</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="text-purple-800">Week Streak</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Gym Kardashian
                </span>
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">Welcome back, {user?.name || 'User'}!</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full">
                <Coins className="w-5 h-5" />
                <span className="font-semibold">{credits}</span>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'socialite', label: 'My Socialite', icon: Heart },
              { id: 'workout', label: 'Workout', icon: Activity },
              { id: 'exercises', label: 'Exercises', icon: Target },
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
              { id: 'stats', label: 'Stats', icon: Trophy }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default Dashboard;