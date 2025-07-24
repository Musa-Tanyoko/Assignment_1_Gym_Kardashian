import React, { useState } from 'react';
import { Droplets, Smile, Gift, Utensils, Sparkles, TrendingUp, Star, Target } from 'lucide-react';
import { SocialiteStats, getCurrentFameLevel, getNextFameLevel } from '../types/socialite';

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{getSocialiteEmoji(socialite.type)}</div>
        <input
          className="text-xl font-bold text-gray-900 text-center mb-2 bg-gray-100 rounded px-2 py-1"
          value={name}
          onChange={handleNameChange}
          maxLength={20}
        />
        <div className="space-y-2">
          <p className="text-sm text-gray-500 capitalize">
            {currentFameLevel.name} • Level {socialite.level} • Age {Math.floor(socialite.age)} days
          </p>
          
          {/* Fame Progress */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium text-gray-700">Fame: {socialite.fame}</span>
              </div>
              {nextFameLevel && (
                <span className="text-xs text-gray-500">
                  {nextFameLevel.name} at {nextFameLevel.fameRequired}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            {nextFameLevel && (
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(levelProgress)}% to next level
              </p>
            )}
          </div>

          {/* Experience Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
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
          </div>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Utensils className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Hunger</span>
            </div>
            <span className={`text-sm font-semibold ${getHealthTextColor(socialite.hunger)}`}>
              {Math.round(socialite.hunger)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(socialite.hunger)}`}
              style={{ width: `${socialite.hunger}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Droplets className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Hygiene</span>
            </div>
            <span className={`text-sm font-semibold ${getHealthTextColor(socialite.hygiene)}`}>
              {Math.round(socialite.hygiene)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(socialite.hygiene)}`}
              style={{ width: `${socialite.hygiene}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Smile className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Happiness</span>
            </div>
            <span className={`text-sm font-semibold ${getHealthTextColor(socialite.happiness)}`}>
              {Math.round(socialite.happiness)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(socialite.happiness)}`}
              style={{ width: `${socialite.happiness}%` }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onFeed}
          disabled={credits < 10}
          className="flex flex-col items-center p-3 bg-orange-50 hover:bg-orange-100 disabled:bg-gray-50 disabled:text-gray-400 text-orange-700 rounded-lg transition-colors"
        >
          <Utensils className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Feed</span>
          <span className="text-xs text-gray-500">10c</span>
        </button>
        <button
          onClick={onClean}
          disabled={credits < 15}
          className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-50 disabled:text-gray-400 text-blue-700 rounded-lg transition-colors"
        >
          <Sparkles className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Clean</span>
          <span className="text-xs text-gray-500">15c</span>
        </button>
        <button
          onClick={onPlay}
          disabled={credits < 5}
          className="flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 disabled:bg-gray-50 disabled:text-gray-400 text-purple-700 rounded-lg transition-colors"
        >
          <Gift className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Play</span>
          <span className="text-xs text-gray-500">5c</span>
        </button>
      </div>
    </div>
  );
};

export default SocialiteCard;