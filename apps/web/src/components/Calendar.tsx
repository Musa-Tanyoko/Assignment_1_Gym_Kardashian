import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface User {
  uid: string;
  name?: string;
  email?: string;
  workoutsPerWeek?: number;
  // Add more fields as needed
}
interface CalendarProps {
  user: User;
}

const Calendar: React.FC<CalendarProps> = ({ user }) => {
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
  const workoutDays: Record<number, { completed: boolean; type: string }> = {
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
  
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };
  
  const getWorkoutTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      strength: 'bg-emerald-500',
      cardio: 'bg-blue-500',
      flexibility: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-400';
  };

  const getWorkoutTypeVariant = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      strength: 'success',
      cardio: 'info',
      flexibility: 'secondary'
    };
    return variants[type] || 'default';
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
        <motion.div
          key={day}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: day * 0.01 }}
          whileHover={{ scale: 1.02 }}
          className={`h-24 border border-gray-200 p-2 hover:bg-gray-50 transition-colors ${
            isToday ? 'bg-blue-50 border-blue-300' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
              {day}
            </span>
            {isToday && (
              <motion.div 
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          
          {workout && (
            <motion.div 
              className="mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant={getWorkoutTypeVariant(workout.type)} className="text-xs">
                {workout.completed ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Circle className="w-3 h-3 mr-1" />
                )}
                {workout.type}
              </Badge>
            </motion.div>
          )}
        </motion.div>
      );
    }
    
    return days;
  };
  
  const completedWorkouts = Object.values(workoutDays).filter(w => w.completed).length;
  const totalWorkouts = Object.keys(workoutDays).length;
  const completionRate = Math.round((completedWorkouts / totalWorkouts) * 100);
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">
                {monthNames[month]} {year}
              </CardTitle>
              <p className="text-gray-600">
                {user?.workoutsPerWeek || 3} workouts per week recommended
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(-1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(1)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600">{completedWorkouts}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{totalWorkouts - completedWorkouts}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Week day headers */}
          <div className="grid grid-cols-7 bg-gray-50">
            {weekDays.map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <motion.div 
            className="grid grid-cols-7"
            key={`${year}-${month}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {renderCalendarDays()}
          </motion.div>
        </CardContent>
      </Card>
      
      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Workout Types</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Calendar;