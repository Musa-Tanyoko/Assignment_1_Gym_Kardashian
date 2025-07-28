import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Coins, Trophy, Timer, Sparkles, Camera, Plane, Rss, Smile, Dog, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SocialiteCard from './SocialiteCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

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

  const currentStep = demoSteps[demoStep];

  const lifestyleActions = [
    { action: spaDay, icon: Sparkles, label: 'Spa Day', cost: 20, color: 'pink' },
    { action: glamTeam, icon: Smile, label: 'Glam Team', cost: 15, color: 'pink' },
    { action: designerOutfit, icon: Rss, label: 'Designer Outfit', cost: 25, color: 'pink' },
    { action: photoshoot, icon: Camera, label: 'Photoshoot', cost: 10, color: 'pink' },
    { action: jetSetTrip, icon: Plane, label: 'Jet-Set Trip', cost: 30, color: 'pink' },
    { action: socialPost, icon: User, label: 'Social Post', cost: 5, color: 'pink' },
    { action: wellnessRitual, icon: Sparkles, label: 'Wellness Ritual', cost: 10, color: 'pink' },
    { action: socialiteCare, icon: Dog, label: 'Socialite Care', cost: 8, color: 'pink' },
    { action: eventRedCarpet, icon: Sparkles, label: 'Red Carpet Event', cost: 40, color: 'pink' },
    { action: prPublicist, icon: Sparkles, label: 'PR & Publicist', cost: 12, color: 'pink' }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
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
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <motion.div 
                  className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {demoStep + 1}
                </motion.div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{currentStep.title}</CardTitle>
                  <p className="text-gray-600 mb-4">{currentStep.description}</p>
                  <div className="flex space-x-2">
                    {demoStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setDemoStep(Math.max(0, demoStep - 1))}
                      >
                        Previous
                      </Button>
                    )}
                    {demoStep < demoSteps.length - 1 && demoStep !== 2 && (
                      <Button
                        variant="gradient"
                        onClick={() => setDemoStep(Math.min(demoSteps.length - 1, demoStep + 1))}
                      >
                        Next Step
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Socialite Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`transition-all duration-300 ${
              currentStep.highlight === 'socialite' || currentStep.highlight === 'needs' || currentStep.highlight === 'lifestyle'
                ? 'ring-4 ring-pink-300 ring-opacity-50' 
                : ''
            }`}
          >
            <Card>
              <CardContent className="p-6">
                <SocialiteCard
                  socialite={socialite}
                  credits={credits}
                  onFeed={() => {}}
                  onClean={() => {}}
                  onPlay={() => {}}
                />
                <div className="space-y-2 mt-6">
                  <div className="grid grid-cols-2 gap-2">
                    {lifestyleActions.map((action, index) => (
                      <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={action.action}
                          disabled={credits < action.cost}
                          className="w-full h-auto p-2 flex items-center bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 text-pink-700 border-pink-200"
                        >
                          <action.icon className="w-5 h-5 mr-1" />
                          {action.label}
                          <span className="ml-auto text-xs">{action.cost}c</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-pink-100 rounded-lg p-2 text-pink-700">Fame: {socialite.fame}</div>
                    <div className="bg-pink-100 rounded-lg p-2 text-pink-700">Level: {socialite.level}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Workout Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`transition-all duration-300 ${
              currentStep.highlight === 'workout' 
                ? 'ring-4 ring-emerald-300 ring-opacity-50' 
                : ''
            }`}
          >
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Demo Workout</CardTitle>
                
                {!isWorkingOut ? (
                  <motion.div 
                    className="text-center space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <motion.div 
                      className="text-4xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      🏋️‍♀️
                    </motion.div>
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

                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={startWorkout}
                      className="w-full"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Demo Workout
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-center space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <motion.div 
                      className="text-4xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      💅
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Working Out!</h4>
                      <p className="text-gray-600 text-sm">
                        Slay queen! You're earning credits to pamper your fabulous socialites.
                      </p>
                    </div>

                    <div className="text-center">
                      <motion.div 
                        className="text-4xl font-bold text-emerald-600 mb-2"
                        key={workoutTime}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {(workoutTime / 10).toFixed(1)}s
                      </motion.div>
                      <Progress value={((30 - workoutTime) / 30) * 100} className="h-3" />
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-emerald-600">
                      <Timer className="w-5 h-5" />
                      <span className="font-medium">Exercise in progress...</span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          className="mt-12 text-center bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Real Journey?</h2>
          <p className="text-xl text-emerald-100 mb-6">
            This was just a taste! Create your account to unlock the full Gym Kardioshian experience with personalized workouts, multiple socialites, and much more.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onNavigate('auth')}
            className="text-lg"
          >
            Get Started for Free
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DemoPage;