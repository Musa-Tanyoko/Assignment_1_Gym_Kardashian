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
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface HomepageProps {
  onNavigate: (route: string) => void;
}

const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      icon: Heart,
      title: "Virtual Socialite Care",
      description: "Adopt and care for your digital socialite that depends on your fitness progress. Feed, pamper, and entertain them by completing workouts.",
      gradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-500"
    },
    {
      icon: Target,
      title: "Personalized Workouts",
      description: "Get tailored exercise plans based on your age, fitness level, BMI, and personal goals for optimal results.",
      gradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500"
    },
    {
      icon: Trophy,
      title: "Earn Credits",
      description: "Complete exercises to earn credits. Use them to buy food, gifts, and accessories for your growing socialite collection.",
      gradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Built-in calendar helps you plan workouts and track your socialite's daily needs and health status.",
      gradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-500"
    },
    {
      icon: Users,
      title: "Socialite Growth System",
      description: "Watch your socialite grow, evolve, and become more fabulous. More fame means more motivation to stay active!",
      gradient: "from-pink-50 to-pink-100",
      iconBg: "bg-pink-500"
    },
    {
      icon: Timer,
      title: "Guided Workouts",
      description: "Follow along with detailed exercise descriptions, timers, and rest periods for perfect form and results.",
      gradient: "from-indigo-50 to-indigo-100",
      iconBg: "bg-indigo-500"
    }
  ];

  return (
    <motion.div 
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
                <img src="https://i.ibb.co/FLB0NdKD/logo.jpg" alt="Gym Kardioshian Logo" className="w-10 h-10 rounded-full bg-white border border-gray-200 object-contain" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Gym Kardioshian
              </span>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('demo')}
              >
                Demo
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate('progressive-demo')}
              >
                Progressive Demo
              </Button>
              <Button
                variant="gradient"
                onClick={() => onNavigate('auth')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative py-20 overflow-hidden"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Keeping Up With Your
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Fitness Goals
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
                  Transform your fitness journey into a glamorous adventure. Care for your virtual socialite while achieving your body goals with personalized workouts that keep you motivated and fabulous.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                variant="gradient"
                size="lg"
                onClick={() => onNavigate('auth')}
                className="text-lg"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate('demo')}
                className="text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-white"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Why Choose Gym Kardioshian?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Experience fitness with style and glamour through our innovative socialite care system
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className={`bg-gradient-to-br ${feature.gradient} h-full hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-8">
                    <motion.div 
                      className={`w-12 h-12 ${feature.iconBg} rounded-full flex items-center justify-center mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-4">{feature.title}</CardTitle>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600"
        variants={itemVariants}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Keep Up With Your Goals?
          </motion.h2>
          <motion.p 
            className="text-xl text-emerald-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
                Join thousands who've transformed their fitness journey with Gym Kardioshian
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('auth')}
              className="text-lg"
            >
              Get Started for Free
              <Star className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-white py-12"
        variants={itemVariants}
      >
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
      </motion.footer>
    </motion.div>
  );
};

export default Homepage;