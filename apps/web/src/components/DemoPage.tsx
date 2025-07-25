import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Coins, Trophy, Timer, Sparkles, Camera, Plane, Rss, Smile, Dog, User } from 'lucide-react';
import SocialiteCard from './SocialiteCard';

interface DemoPageProps {
  onNavigate: (route: string) => void;
}

const DemoPage: React.FC<DemoPageProps> = ({ onNavigate }) => {
  const [demoStep, setDemoStep] = useState(0);
  const [socialite, setSocialite] = useState({
    id: 1,
    name: 'Your Socialite',
    type: 'influencer' as const,
    level: 1,
    age: 12,
    fame: 100,
    experience: 0,
    hunger: 45,
    hygiene: 30,
    happiness: 60,
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
  const [credits, setCredits] = useState(75);
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(30);

  const demoSteps = [
    {
      title: "Meet Your Supermodel Socialite",
      description: "This is your high-maintenance avatar! She lives a celebrity lifestyle funded by your fitness activity. Her needs are luxury: spa, glam, outfits, events, and more.",
      highlight: "socialite"
    },
    {
      title: "Neglect = Meltdowns",
      description: "If you don't meet her needs, she gets moody, loses followers, and brand deals flop. Credits from workouts keep her happy and famous!",
      highlight: "needs"
    },
    {
      title: "Earn Credits Through Exercise",
      description: "Work out to earn credits. Let's start a quick 30-second session to fund her next spa day!",
      highlight: "workout"
    },
    {
      title: "Level Up Her Lifestyle",
      description: "Use credits to unlock luxury cities, new outfits, and fame. Keep her happy to unlock endorsements and collabs!",
      highlight: "lifestyle"
    }
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
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

  // Lifestyle needs actions
  const spaDay = () => { if (credits >= 20) { setSocialite(s => ({ ...s, spa: Math.min(100, s.spa + 30) })); setCredits(c => c - 20); } };
  const glamTeam = () => { if (credits >= 15) { setSocialite(s => ({ ...s, glam: Math.min(100, s.glam + 25) })); setCredits(c => c - 15); } };
  const designerOutfit = () => { if (credits >= 25) { setSocialite(s => ({ ...s, outfits: Math.min(100, s.outfits + 40) })); setCredits(c => c - 25); } };
  const photoshoot = () => { if (credits >= 10) { setSocialite(s => ({ ...s, photoshoots: Math.min(100, s.photoshoots + 20), fame: s.fame + 10 })); setCredits(c => c - 10); } };
  const jetSetTrip = () => { if (credits >= 30) { setSocialite(s => ({ ...s, trips: Math.min(100, s.trips + 50), fame: s.fame + 20 })); setCredits(c => c - 30); } };
  const socialPost = () => { if (credits >= 5) { setSocialite(s => ({ ...s, posts: Math.min(100, s.posts + 10), fame: s.fame + 5 })); setCredits(c => c - 5); } };
  const wellnessRitual = () => { if (credits >= 10) { setSocialite(s => ({ ...s, wellness: Math.min(100, s.wellness + 20) })); setCredits(c => c - 10); } };
  const socialiteCare = () => { if (credits >= 8) { setSocialite(s => ({ ...s, petcare: Math.min(100, s.petcare + 15) })); setCredits(c => c - 8); } };
  const eventRedCarpet = () => { if (credits >= 40) { setSocialite(s => ({ ...s, events: Math.min(100, s.events + 60), fame: s.fame + 30 })); setCredits(c => c - 40); } };
  const prPublicist = () => { if (credits >= 12) { setSocialite(s => ({ ...s, pr: Math.min(100, s.pr + 20) })); setCredits(c => c - 12); } };

  // Removed unused getNeedColor function

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
              <img src="https://i.ibb.co/FLB0NdKD/logo.jpg" alt="Gym Kardioshian Logo" className="w-8 h-8 rounded-full bg-white border border-gray-200 object-contain" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Gym Kardioshian Demo
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
          {/* Socialite Card */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-300 ${
            currentStep.highlight === 'socialite' || currentStep.highlight === 'needs' || currentStep.highlight === 'lifestyle'
              ? 'border-pink-300 shadow-lg' 
              : 'border-gray-200'
          }`}>
            <SocialiteCard
              socialite={socialite}
              credits={credits}
              onFeed={() => {}}
              onClean={() => {}}
              onPlay={() => {}}
            />
            <div className="space-y-2 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={spaDay} disabled={credits < 20} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><Sparkles className="w-5 h-5 mr-1" /> Spa Day <span className="ml-auto text-xs">20c</span></button>
                <button onClick={glamTeam} disabled={credits < 15} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><Smile className="w-5 h-5 mr-1" /> Glam Team <span className="ml-auto text-xs">15c</span></button>
                <button onClick={designerOutfit} disabled={credits < 25} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><Rss className="w-5 h-5 mr-1" /> Designer Outfit <span className="ml-auto text-xs">25c</span></button>
                <button onClick={photoshoot} disabled={credits < 10} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><Camera className="w-5 h-5 mr-1" /> Photoshoot <span className="ml-auto text-xs">10c</span></button>
                <button onClick={jetSetTrip} disabled={credits < 30} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><Plane className="w-5 h-5 mr-1" /> Jet-Set Trip <span className="ml-auto text-xs">30c</span></button>
                <button onClick={socialPost} disabled={credits < 5} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><User className="w-5 h-5 mr-1" /> Social Post <span className="ml-auto text-xs">5c</span></button>
                <button onClick={wellnessRitual} disabled={credits < 10} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><Sparkles className="w-5 h-5 mr-1" /> Wellness Ritual <span className="ml-auto text-xs">10c</span></button>
                <button onClick={socialiteCare} disabled={credits < 8} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><Dog className="w-5 h-5 mr-1" /> Socialite Care <span className="ml-auto text-xs">8c</span></button>
                <button onClick={eventRedCarpet} disabled={credits < 40} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><Sparkles className="w-5 h-5 mr-1" /> Red Carpet Event <span className="ml-auto text-xs">40c</span></button>
                <button onClick={prPublicist} disabled={credits < 12} className="flex items-center p-2 bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 rounded-lg transition-colors"><Sparkles className="w-5 h-5 mr-1" /> PR & Publicist <span className="ml-auto text-xs">12c</span></button>
              </div>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-pink-100 rounded-lg p-2 text-pink-700">Fame: {socialite.fame}</div>
                <div className="bg-pink-100 rounded-lg p-2 text-pink-700">Level: {socialite.level}</div>
              </div>
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
                    A glamorous 30-second demonstration workout to earn credits for your fabulous socialites
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
                    Slay queen! You're earning credits to pamper your fabulous socialites.
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
            This was just a taste! Create your account to unlock the full Gym Kardioshian experience with personalized workouts, multiple socialites, and much more.
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