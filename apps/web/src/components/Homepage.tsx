import React from 'react';
import { 
  Heart, 
  Trophy, 
  Calendar, 
  Play, 
  Star,
  ArrowRight,
  Users,
  Target,
  Timer
} from 'lucide-react';

interface HomepageProps {
  onNavigate: (route: string) => void;
}

const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
                <img src="https://i.ibb.co/FLB0NdKD/logo.jpg" alt="Gym Kardioshian Logo" className="w-10 h-10 rounded-full bg-white border border-gray-200 object-contain" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Gym Kardioshian
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => onNavigate('demo')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Demo
              </button>
              <button
                onClick={() => onNavigate('progressive-demo')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Progressive Demo
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Keep Up With Your
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Fitness Goals
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Transform your fitness journey into a glamorous adventure. Care for your virtual socialite while achieving your body goals with personalized workouts that keep you motivated and fabulous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('auth')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('demo')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full text-lg font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Why Choose Gym Kardioshian?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Experience fitness with style and glamour through our innovative socialite care system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Virtual Socialite Care</h3>
              <p className="text-gray-600">
                Adopt and care for your digital socialite that depends on your fitness progress. 
                Feed, pamper, and entertain them by completing workouts.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Workouts</h3>
              <p className="text-gray-600">
                Get tailored exercise plans based on your age, fitness level, BMI, 
                and personal goals for optimal results.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Earn Credits</h3>
              <p className="text-gray-600">
                Complete exercises to earn credits. Use them to buy food, gifts, 
                and accessories for your growing socialite collection.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Scheduling</h3>
              <p className="text-gray-600">
                    Built-in calendar helps you plan workouts and track your socialite's 
                daily needs and health status.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Socialite Growth System</h3>
              <p className="text-gray-600">
                Watch your socialite grow, evolve, and become more fabulous. More socialites mean 
                more motivation to stay active!
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mb-6">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Guided Workouts</h3>
              <p className="text-gray-600">
                Follow along with detailed exercise descriptions, timers, 
                and rest periods for perfect form and results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Keep Up With Your Goals?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
                Join thousands who've transformed their fitness journey with Gym Kardioshian
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-4 bg-white text-emerald-600 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            Get Started for Free
            <Star className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src="https://i.ibb.co/FLB0NdKD/logo.jpg" alt="Gym Kardioshian Logo" className="w-8 h-8 rounded-full bg-white border border-gray-200 object-contain" />
              <span className="text-xl font-bold">Gym Kardioshian</span>
            </div>
            <p className="text-gray-400">
              Keeping up with your fitness goals, one workout at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;