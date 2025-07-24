import React from 'react';
import { Heart, Droplets, Smile, Gift, Utensils, Sparkles } from 'lucide-react';

const PetCard = ({ pet, onFeed, onClean, onPlay, credits }) => {
  const getPetEmoji = (type) => {
    const emojis = {
      cat: '🐱',
      dog: '🐶',
      fish: '🐠',
      bird: '🐦'
    };
    return emojis[type] || '🐾';
  };

  const getHealthColor = (value) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthTextColor = (value) => {
    if (value > 70) return 'text-green-700';
    if (value > 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{getPetEmoji(pet.type)}</div>
        <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
        <p className="text-sm text-gray-500 capitalize">
          Level {pet.level} {pet.type} • Age {Math.floor(pet.age)} days
        </p>
      </div>

      {/* Health Bars */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Utensils className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Hunger</span>
            </div>
            <span className={`text-sm font-semibold ${getHealthTextColor(pet.hunger)}`}>
              {Math.round(pet.hunger)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(pet.hunger)}`}
              style={{ width: `${pet.hunger}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Droplets className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Hygiene</span>
            </div>
            <span className={`text-sm font-semibold ${getHealthTextColor(pet.hygiene)}`}>
              {Math.round(pet.hygiene)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(pet.hygiene)}`}
              style={{ width: `${pet.hygiene}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Smile className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Happiness</span>
            </div>
            <span className={`text-sm font-semibold ${getHealthTextColor(pet.happiness)}`}>
              {Math.round(pet.happiness)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getHealthColor(pet.happiness)}`}
              style={{ width: `${pet.happiness}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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

export default PetCard;