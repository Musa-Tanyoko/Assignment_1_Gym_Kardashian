import React, { useState, useEffect } from 'react';
import PetCard from './PetCard';
import WorkoutTimer from './WorkoutTimer';
import Calendar from './Calendar';
import ExerciseLibrary from './ExerciseLibrary';
import { 
  Plus, 
  Coins, 
  Trophy, 
  Calendar as CalendarIcon, 
  Play, 
  Target,
  Settings,
  Home,
  Activity,
  Heart
} from 'lucide-react';

const Dashboard = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('pets');
  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'Buddy',
      type: 'dog',
      age: 15,
      hunger: 85,
      hygiene: 70,
      happiness: 90,
      level: 3
    }
  ]);
  const [credits, setCredits] = useState(user?.credits || 150);
  const [showWorkout, setShowWorkout] = useState(false);

  const addPet = () => {
    const petTypes = ['cat', 'dog', 'fish', 'bird'];
    const newPet = {
      id: Date.now(),
      name: `Pet ${pets.length + 1}`,
      type: petTypes[Math.floor(Math.random() * petTypes.length)],
      age: 1,
      hunger: 100,
      hygiene: 100,
      happiness: 100,
      level: 1
    };
    setPets([...pets, newPet]);
  };

  const feedPet = (petId) => {
    if (credits >= 10) {
      setPets(pets.map(pet => 
        pet.id === petId 
          ? { ...pet, hunger: Math.min(100, pet.hunger + 30) }
          : pet
      ));
      setCredits(credits - 10);
    }
  };

  const cleanPet = (petId) => {
    if (credits >= 15) {
      setPets(pets.map(pet => 
        pet.id === petId 
          ? { ...pet, hygiene: Math.min(100, pet.hygiene + 40) }
          : pet
      ));
      setCredits(credits - 15);
    }
  };

  const playWithPet = (petId) => {
    if (credits >= 5) {
      setPets(pets.map(pet => 
        pet.id === petId 
          ? { ...pet, happiness: Math.min(100, pet.happiness + 25) }
          : pet
      ));
      setCredits(credits - 5);
    }
  };

  const completeWorkout = (earnedCredits) => {
    setCredits(credits + earnedCredits);
    setShowWorkout(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPets(currentPets => 
        currentPets.map(pet => ({
          ...pet,
          hunger: Math.max(0, pet.hunger - 2),
          hygiene: Math.max(0, pet.hygiene - 1),
          happiness: Math.max(0, pet.happiness - 1.5),
          age: pet.age + 0.1
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pets':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Pets</h2>
              <button
                onClick={addPet}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adopt Pet
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onFeed={() => feedPet(pet.id)}
                  onClean={() => cleanPet(pet.id)}
                  onPlay={() => playWithPet(pet.id)}
                  credits={credits}
                />
              ))}
            </div>
          </div>
        );

      case 'workout':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Today's Workout</h2>
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
                onComplete={completeWorkout}
                onClose={() => setShowWorkout(false)}
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Workout</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">Full Body</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium capitalize">{user?.activityLevel || 'Beginner'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-medium text-emerald-600">50-80</span>
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
              { id: 'pets', label: 'My Pets', icon: Heart },
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
                      ? 'border-emerald-500 text-emerald-600'
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