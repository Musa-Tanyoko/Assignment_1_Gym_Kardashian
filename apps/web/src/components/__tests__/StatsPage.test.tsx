import { render, screen, waitFor } from '@testing-library/react';
import { StatsPage } from '../StatsPage';
import { useGetUserStats } from '../../hooks/useTRPCWorkout';
import { useGetCurrentUser } from '../../hooks/useTRPCAuth';
import '@testing-library/jest-dom';

// Mock the hooks
jest.mock('../../hooks/useTRPCWorkout', () => ({
  useGetUserStats: jest.fn(),
}));

jest.mock('../../hooks/useTRPCAuth', () => ({
  useGetCurrentUser: jest.fn(),
}));

const mockUseGetUserStats = useGetUserStats as jest.MockedFunction<typeof useGetUserStats>;
const mockUseGetCurrentUser = useGetCurrentUser as jest.MockedFunction<typeof useGetCurrentUser>;

describe('StatsPage', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockUseGetCurrentUser.mockReturnValue({
      data: { uid: 'test-user', email: 'test@example.com' },
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when fetching stats', () => {
    mockUseGetUserStats.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<StatsPage onClose={mockOnClose} />);
    
    expect(screen.getByText('Loading your stats...')).toBeInTheDocument();
  });

  it('shows error state when stats fetch fails', () => {
    mockUseGetUserStats.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch stats'),
    });

    render(<StatsPage onClose={mockOnClose} />);
    
    expect(screen.getByText('Error loading stats')).toBeInTheDocument();
    expect(screen.getByText('Please try again later.')).toBeInTheDocument();
  });

  it('shows new user state when no workouts completed', () => {
    mockUseGetUserStats.mockReturnValue({
      data: {
        sessions: 0,
        exercisesCompleted: 0,
        streak: 0,
        hours: 0,
        totalCalories: 0,
        averageWorkoutDuration: 0,
        lastWorkoutDate: null,
        weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
        monthlyProgress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      isLoading: false,
      error: null,
    });

    render(<StatsPage onClose={mockOnClose} />);
    
    expect(screen.getByText('No workout data yet!')).toBeInTheDocument();
    expect(screen.getByText('Complete your first workout to start tracking your fitness journey and see your progress here.')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Should show 0 workouts
  });

  it('shows stats for users with workout history', () => {
    mockUseGetUserStats.mockReturnValue({
      data: {
        sessions: 5,
        exercisesCompleted: 25,
        streak: 3,
        hours: 2.5,
        totalCalories: 1250,
        averageWorkoutDuration: 30,
        lastWorkoutDate: '2024-01-15T10:00:00Z',
        weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
        monthlyProgress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      isLoading: false,
      error: null,
    });

    render(<StatsPage onClose={mockOnClose} />);
    
    expect(screen.getByText('Your Fitness Stats')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Total workouts
    expect(screen.getByText('3 days')).toBeInTheDocument(); // Current streak
    expect(screen.getByText('1,250')).toBeInTheDocument(); // Calories burned
    expect(screen.getByText('30 min')).toBeInTheDocument(); // Average duration
  });

  it('calls onClose when close button is clicked', () => {
    mockUseGetUserStats.mockReturnValue({
      data: {
        sessions: 0,
        exercisesCompleted: 0,
        streak: 0,
        hours: 0,
        totalCalories: 0,
        averageWorkoutDuration: 0,
        lastWorkoutDate: null,
        weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
        monthlyProgress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      isLoading: false,
      error: null,
    });

    render(<StatsPage onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    closeButton.click();
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
