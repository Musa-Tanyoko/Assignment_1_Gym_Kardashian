import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Heart, Coins, Trophy, Timer } from 'lucide-react';

const DemoPage = ({ onNavigate }) => {
  const [demoStep, setDemoStep] = useState(0);
  const [petHealth, setPetHealth] = useState({
    hunger: 45,
    hygiene: 30,
    happiness: 60
  });
  const [credits, setCredits] = useState(75);
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(30);

  const demoSteps = [
    {
      title: "Meet Your Virtual Pet",
      description: "This is Buddy, your virtual pet who depends on you for care. Notice his health bars are low - he needs your help!",
      highlight: "pet"
    },
    {
      title: "Low Health Means Trouble",
      description: "When health bars are low, your pet becomes sad. You need credits to feed, clean, and play with your pet.",
      highlight: "health"
    },
    {
      title: "Earn Credits Through Exercise",
      description: "Complete workouts to earn credits. Let's start a quick 30-second exercise session!",
      highlight: "workout"
    },
    {
      title: "Watch Your Pet Improve",
      description: "Great job! Use your earned credits to care for Buddy and watch his happiness grow.",
      highlight: "care"
    }
  ];

  useEffect(() => {
    let interval;
    if (isWorkingOut && workoutTime > 0) {
      interval = setInterval(() => {
        setWorkoutTime(time => time - 1);
      }, 100);
    } else if (workoutTime === 0 && isWorkingOut) {
      setIsWorkingOut(false);
      setCredits(credits + 50);
      setWorkoutTime(30);
      setDemoStep(3);
    }
    return () => clearInterval(interval);
  }, [isWorkingOut, workoutTime, credits]);

  const startWorkout = () => {
    setIsWorkingOut(true);
    setDemoStep(2);
  };

  const feedPet = () => {
    if (credits >= 10) {
      setPetHealth(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 30) }));
      setCredits(credits - 10);
    }
  };

  const cleanPet = () => {
    if (credits >= 15) {
      setPetHealth(prev => ({ ...prev, hygiene: Math.min(100, prev.hygiene + 40) }));
      setCredits(credits - 15);
    }
  };

  const playWithPet = () => {
    if (credits >= 5) {
      setPetHealth(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 25) }));
      setCredits(credits - 5);
    }
  };

  const getHealthColor = (value) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const currentStep = demoSteps[demoStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Gym Kardashian Demo
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full">
              <Coins className="w-4 h-4" />
              <span className="font-semibold">{credits}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {demoStep + 1}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>
              <p className="text-gray-600 mb-4">{currentStep.description}</p>
              <div className="flex space-x-2">
                {demoStep > 0 && (
                  <button
                    onClick={() => setDemoStep(Math.max(0, demoStep - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Previous
                  </button>
                )}
                {demoStep < demoSteps.length - 1 && demoStep !== 2 && (
                  <button
                    onClick={() => setDemoStep(Math.min(demoSteps.length - 1, demoStep + 1))}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
                  >
                    Next Step
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pet Card */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-300 ${
            currentStep.highlight === 'pet' || currentStep.highlight === 'health' || currentStep.highlight === 'care'
              ? 'border-emerald-300 shadow-lg' 
              : 'border-gray-200'
          }`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">🐶</div>
              <h3 className="text-xl font-bold text-gray-900">Buddy</h3>
              <p className="text-sm text-gray-500">Level 2 Dog • Age 12 days</p>
            </div>

            {/* Health Bars */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Hunger</span>
                  <span className="text-sm font-semibold text-orange-600">
                    {Math.round(petHealth.hunger)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(petHealth.hunger)}`}
                    style={{ width: `${petHealth.hunger}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Hygiene</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {Math.round(petHealth.hygiene)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(petHealth.hygiene)}`}
                    style={{ width: `${petHealth.hygiene}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Happiness</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {Math.round(petHealth.happiness)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(petHealth.happiness)}`}
                    style={{ width: `${petHealth.happiness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Care Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={feedPet}
                disabled={credits < 10}
                className="flex flex-col items-center p-3 bg-orange-50 hover:bg-orange-100 disabled:bg-gray-50 disabled:text-gray-400 text-orange-700 rounded-lg transition-colors"
              >
                <span className="text-lg mb-1">🍖</span>
                <span className="text-xs font-medium">Feed</span>
                <span className="text-xs text-gray-500">10c</span>
              </button>

              <button
                onClick={cleanPet}
                disabled={credits < 15}
                className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-50 disabled:text-gray-400 text-blue-700 rounded-lg transition-colors"
              >
                <span className="text-lg mb-1">🛁</span>
                <span className="text-xs font-medium">Clean</span>
                <span className="text-xs text-gray-500">15c</span>
              </button>

              <button
                onClick={playWithPet}
                disabled={credits < 5}
                className="flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 disabled:bg-gray-50 disabled:text-gray-400 text-purple-700 rounded-lg transition-colors"
              >
                <span className="text-lg mb-1">🎾</span>
                <span className="text-xs font-medium">Play</span>
                <span className="text-xs text-gray-500">5c</span>
              </button>
            </div>
          </div>

          {/* Workout Section */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-300 ${
            currentStep.highlight === 'workout' 
              ? 'border-emerald-300 shadow-lg' 
              : 'border-gray-200'
          }`}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Demo Workout</h3>
            
            {!isWorkingOut ? (
              <div className="text-center space-y-6">
                <div className="text-4xl">🏋️‍♀️</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Push-ups</h4>
                  <p className="text-gray-600 text-sm">
                    A glamorous 30-second demonstration workout to earn credits for your fabulous pets
                  </p>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-emerald-800">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">Earn 50 credits</span>
                  </div>
                </div>

                <button
                  onClick={startWorkout}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Demo Workout
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="text-4xl">💅</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Working Out!</h4>
                  <p className="text-gray-600 text-sm">
                    Slay queen! You're earning credits to pamper your fabulous pets.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    {(workoutTime / 10).toFixed(1)}s
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-100"
                      style={{ width: `${((30 - workoutTime) / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 text-emerald-600">
                  <Timer className="w-5 h-5" />
                  <span className="font-medium">Exercise in progress...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Real Journey?</h2>
          <p className="text-xl text-emerald-100 mb-6">
            This was just a taste! Create your account to unlock the full Gym Kardashian experience with personalized workouts, multiple pets, and much more.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-4 bg-white text-emerald-600 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;