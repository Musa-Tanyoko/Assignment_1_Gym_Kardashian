import React, { useState } from 'react';
import { Sparkles, TrendingUp, Star, Target, Heart, Camera, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { SocialiteStats, getCurrentFameLevel, getNextFameLevel } from '../types/socialite';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface SocialiteCardProps {
  socialite: SocialiteStats;
  onFeed: () => void;
  onClean: () => void;
  onPlay: () => void;
  credits: number;
}

const emojis: Record<string, string> = {
  influencer: '💅',
  celebrity: '👑',
  mogul: '👜',
  icon: '🏆'
};

const SocialiteCard: React.FC<SocialiteCardProps> = ({ socialite, onFeed, onClean, onPlay, credits }) => {
  const [name, setName] = useState<string>(socialite.name || 'Your Socialite');

  const getSocialiteEmoji = (type: string) => emojis[type] || '🧑‍🎤';
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  
  const getHealthColor = (value: number) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getHealthTextColor = (value: number) => {
    if (value > 70) return 'text-green-700';
    if (value > 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  const currentFameLevel = getCurrentFameLevel(socialite.fame);
  const nextFameLevel = getNextFameLevel(socialite.fame);
  const levelProgress = nextFameLevel 
    ? Math.min(100, ((socialite.fame - currentFameLevel.fameRequired) / (nextFameLevel.fameRequired - currentFameLevel.fameRequired)) * 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="text-6xl mb-3"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {getSocialiteEmoji(socialite.type)}
            </motion.div>
            <input
              className="text-xl font-bold text-gray-900 text-center mb-2 bg-gray-100 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={name}
              onChange={handleNameChange}
              maxLength={20}
            />
            <div className="space-y-2">
              <p className="text-sm text-gray-500 capitalize">
                {currentFameLevel.name} • Level {socialite.level} • Age {Math.floor(socialite.age)} days
              </p>
              
              {/* Fame Progress */}
              <motion.div 
                className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-700">Fame: {socialite.fame}</span>
                  </div>
                  {nextFameLevel && (
                    <Badge variant="outline" className="text-xs">
                      {nextFameLevel.name} at {nextFameLevel.fameRequired}
                    </Badge>
                  )}
                </div>
                <Progress value={levelProgress} className="h-2" />
                {nextFameLevel && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(levelProgress)}% to next level
                  </p>
                )}
              </motion.div>

              {/* Experience Stats */}
              <motion.div 
                className="grid grid-cols-2 gap-2 text-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-blue-50 rounded p-2">
                  <div className="flex items-center">
                    <Target className="w-3 h-3 text-blue-500 mr-1" />
                    <span className="text-blue-700">Workouts: {socialite.totalWorkouts}</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-green-700">XP: {socialite.experience}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Socialite Stats */}
          <motion.div 
            className="space-y-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Heart className="w-4 h-4 text-pink-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Wellness</span>
                </div>
                <span className={`text-sm font-semibold ${getHealthTextColor(socialite.wellness)}`}>
                  {Math.round(socialite.wellness)}%
                </span>
              </div>
              <Progress value={socialite.wellness} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Glam</span>
                </div>
                <span className={`text-sm font-semibold ${getHealthTextColor(socialite.glam)}`}>
                  {Math.round(socialite.glam)}%
                </span>
              </div>
              <Progress value={socialite.glam} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Style</span>
                </div>
                <span className={`text-sm font-semibold ${getHealthTextColor(socialite.outfits)}`}>
                  {Math.round(socialite.outfits)}%
                </span>
              </div>
              <Progress value={socialite.outfits} className="h-2" />
            </div>
          </motion.div>
          
          {/* Socialite Actions */}
          <motion.div 
            className="grid grid-cols-3 gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onFeed}
                disabled={credits < 10}
                className="w-full h-auto p-3 flex flex-col items-center bg-pink-50 hover:bg-pink-100 disabled:bg-gray-50 disabled:text-gray-400 text-pink-700 border-pink-200"
              >
                <Heart className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Wellness</span>
                <span className="text-xs text-gray-500">10c</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onClean}
                disabled={credits < 15}
                className="w-full h-auto p-3 flex flex-col items-center bg-purple-50 hover:bg-purple-100 disabled:bg-gray-50 disabled:text-gray-400 text-purple-700 border-purple-200"
              >
                <Sparkles className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Glam</span>
                <span className="text-xs text-gray-500">15c</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onPlay}
                disabled={credits < 5}
                className="w-full h-auto p-3 flex flex-col items-center bg-blue-50 hover:bg-blue-100 disabled:bg-gray-50 disabled:text-gray-400 text-blue-700 border-blue-200"
              >
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Photo</span>
                <span className="text-xs text-gray-500">5c</span>
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SocialiteCard; 