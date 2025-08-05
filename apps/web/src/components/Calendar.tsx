import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Calendar as CalendarIcon, Target, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useGetCalendarData } from '../hooks/useTRPCWorkout';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { 
  generateWorkoutProgram, 
  getWorkoutForDate, 
  getWeeklyWorkouts, 
  determineUserLevel,
  fitnessGoals,
  type WorkoutSession 
} from '../utils/workoutProgramGenerator';

interface User {
  uid: string;
  name?: string;
  email?: string;
  workoutsPerWeek?: number;
  fitnessGoal?: string;
  totalWorkouts?: number;
  experience?: number;
}

interface CalendarProps {
  user: User;
}

const Calendar: React.FC<CalendarProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
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
  
  // Use the activity logs hook to fetch data
  const { activityLogs } = useActivityLogs(user.uid);
  
  // Generate personalized workout program
  const userLevel = determineUserLevel(user.totalWorkouts || 0, user.experience || 0);
  const workoutProgram = useMemo(() => {
    // Start the workout program from the beginning of the current calendar month
    const startDate = new Date(year, month, 1);
    
    // Force 3 workouts per week for testing
    const workoutsPerWeek = 3;
    
    const program = generateWorkoutProgram(
      user.uid,
      user.fitnessGoal || 'general-fitness',
      workoutsPerWeek,
      startDate,
      userLevel
    );
    
    // Debug: Log the generated sessions
    console.log('Calendar - Generated workout program with', program.sessions.length, 'sessions');
    program.sessions.forEach((session, index) => {
      console.log(`Session ${index + 1}: ${session.title} on ${session.date.toDateString()}`);
    });
    
    return program;
  }, [user.uid, user.fitnessGoal, userLevel, year, month]);
  
  // Create workoutDays object from fetched logs and program
  const workoutDays = useMemo(() => {
    const days: Record<number, any> = {};
    
    // Add completed workouts from activity logs
    if (activityLogs) {
      activityLogs.forEach(log => {
        const logDate = new Date(log.timestamp);
        if (logDate.getFullYear() === year && logDate.getMonth() === month) {
          const day = logDate.getDate();
          days[day] = {
            completed: true,
            type: 'workout',
            isCompleted: true
          };
        }
      });
    }
    
    // Add scheduled workouts from program
    workoutProgram.sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      if (sessionDate.getFullYear() === year && sessionDate.getMonth() === month) {
        const day = sessionDate.getDate();
        console.log(`Calendar - Adding workout to day ${day}: ${session.title}`);
        if (!days[day] || !days[day].isCompleted) {
          days[day] = {
            completed: false,
            type: session.type,
            session: session,
            isScheduled: true
          };
        }
      }
    });
    
    console.log('Calendar - Final workoutDays:', Object.keys(days).length, 'days with workouts');
    return days;
  }, [activityLogs, workoutProgram, year, month]);

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
      flexibility: 'secondary',
      mixed: 'warning'
    };
    return variants[type] || 'default';
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }
    
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
          onClick={() => {
            if (workout) {
              const date = new Date(year, month, day);
              setSelectedDate(date);
            }
          }}
          className={`h-24 border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer ${
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
                {workout.isCompleted ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Circle className="w-3 h-3 mr-1" />
                )}
                {workout.type}
              </Badge>
              {workout.session && (
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {workout.session.title}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      );
    }
    
    return days;
  };
  
  const completedWorkouts = Object.values(workoutDays).filter(w => w.isCompleted).length;
  const scheduledWorkouts = Object.values(workoutDays).filter(w => w.isScheduled).length;
  const totalWorkouts = Object.keys(workoutDays).length;
  const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  
  const selectedWorkout = selectedDate ? workoutDays[selectedDate.getDate()] : null;
  const goal = fitnessGoals[user.fitnessGoal as keyof typeof fitnessGoals] || fitnessGoals['general-fitness'];
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Workout Program Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center">
                <Target className="w-5 h-5 mr-2 text-emerald-600" />
                Your Workout Program
              </CardTitle>
              <p className="text-gray-600">{goal.name} - {goal.description}</p>
            </div>
            <Badge variant="outline" className="text-sm">
              {userLevel} Level
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Workouts per Week</p>
                <p className="text-2xl font-bold text-blue-600">{workoutProgram.workoutsPerWeek}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Program Duration</p>
                <p className="text-2xl font-bold text-green-600">30 Days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Focus Areas</p>
                <p className="text-sm text-gray-600">{goal.focus.join(', ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
      
      <div className="grid grid-cols-4 gap-4">
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
              <div className="text-2xl font-bold text-blue-600">{scheduledWorkouts}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
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
              <div className="text-2xl font-bold text-orange-600">{workoutProgram.sessions.length}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
      
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 bg-gray-50">
            {weekDays.map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>
          
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
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Mixed</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Workout Session Modal */}
      <AnimatePresence>
        {selectedDate && selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedDate(null)}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedWorkout.isCompleted ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-600">Workout Completed</span>
                      </div>
                      <Badge variant={getWorkoutTypeVariant(selectedWorkout.type)}>
                        {selectedWorkout.type}
                      </Badge>
                      <p className="text-gray-600">Great job! You completed your workout for this day.</p>
                    </div>
                  ) : selectedWorkout.session ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant={getWorkoutTypeVariant(selectedWorkout.type)}>
                          {selectedWorkout.type}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{selectedWorkout.session.duration} min</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{selectedWorkout.session.title}</h3>
                        <p className="text-gray-600 mb-4">{selectedWorkout.session.description}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Exercises:</h4>
                          <ul className="space-y-1">
                            {selectedWorkout.session.exercises && selectedWorkout.session.exercises.length > 0 ? (
                              selectedWorkout.session.exercises.map((exercise: string, index: number) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                  {exercise}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500">No exercises defined for this workout</li>
                            )}
                          </ul>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Difficulty</p>
                            <p className="text-lg font-semibold">{selectedWorkout.session.difficulty}/5</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Calories</p>
                            <p className="text-lg font-semibold">{selectedWorkout.session.calories}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Focus Areas:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedWorkout.session.focus && selectedWorkout.session.focus.length > 0 ? (
                              selectedWorkout.session.focus.map((focus: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {focus}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No focus areas defined</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full" variant="gradient">
                        Start Workout
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Circle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No workout scheduled for this day</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Calendar;