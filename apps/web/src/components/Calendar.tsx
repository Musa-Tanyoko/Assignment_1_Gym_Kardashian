import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Target } from 'lucide-react';

const Calendar = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Mock workout data
  const workoutDays = {
    1: { completed: true, type: 'strength' },
    3: { completed: true, type: 'cardio' },
    5: { completed: false, type: 'strength' },
    8: { completed: true, type: 'flexibility' },
    10: { completed: false, type: 'cardio' },
    12: { completed: true, type: 'strength' },
    15: { completed: false, type: 'cardio' },
    17: { completed: true, type: 'strength' },
    19: { completed: false, type: 'flexibility' },
    22: { completed: true, type: 'cardio' },
    24: { completed: false, type: 'strength' },
    26: { completed: false, type: 'cardio' },
    29: { completed: false, type: 'strength' }
  };
  
  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };
  
  const getWorkoutTypeColor = (type) => {
    const colors = {
      strength: 'bg-emerald-500',
      cardio: 'bg-blue-500',
      flexibility: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-400';
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        today.getDate() === day && 
        today.getMonth() === month && 
        today.getFullYear() === year;
      
      const workout = workoutDays[day];
      
      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-2 hover:bg-gray-50 transition-colors ${
            isToday ? 'bg-blue-50 border-blue-300' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
              {day}
            </span>
            {isToday && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          
          {workout && (
            <div className="mt-2">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${
                getWorkoutTypeColor(workout.type)
              }`}>
                {workout.completed ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Circle className="w-3 h-3 mr-1" />
                )}
                {workout.type}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  const completedWorkouts = Object.values(workoutDays).filter(w => w.completed).length;
  const totalWorkouts = Object.keys(workoutDays).length;
  const completionRate = Math.round((completedWorkouts / totalWorkouts) * 100);
  
  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {monthNames[month]} {year}
          </h3>
          <p className="text-gray-600">
            {user?.workoutsPerWeek || 3} workouts per week recommended
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-emerald-600">{completedWorkouts}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalWorkouts - completedWorkouts}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>
      
      {/* Legend */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Workout Types</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Strength Training</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Cardio</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Flexibility</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;