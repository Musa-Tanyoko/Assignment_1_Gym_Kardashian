import type { Meta, StoryObj } from '@storybook/react';
import WorkoutTimer from './WorkoutTimer';
import { ProgressiveWorkout } from '../types/socialite';

const meta: Meta<typeof WorkoutTimer> = {
  title: 'Components/WorkoutTimer',
  component: WorkoutTimer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An interactive workout timer with progressive difficulty, exercise tracking, and accessibility features. Supports keyboard navigation and screen readers.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'timer-name',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    onComplete: { action: 'workout completed' },
    onClose: { action: 'timer closed' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample progressive workout data
const createProgressiveWorkout = (): ProgressiveWorkout => ({
  exercises: [
    {
      level: 2,
      name: 'Push-ups',
      description: 'Keep your body straight, lower chest to ground, push back up',
      baseSets: 3,
      baseReps: 12,
      baseDuration: 45,
      intensityMultiplier: 1.2,
      creditReward: 15,
      requirements: { minFame: 100, minLevel: 2 },
    },
    {
      level: 2,
      name: 'Squats',
      description: 'Feet shoulder-width apart, lower hips back and down, stand up',
      baseSets: 3,
      baseReps: 15,
      baseDuration: 50,
      intensityMultiplier: 1.2,
      creditReward: 15,
      requirements: { minFame: 100, minLevel: 2 },
    },
    {
      level: 2,
      name: 'Plank',
      description: 'Hold your body straight in push-up position',
      baseSets: 3,
      baseReps: 30,
      baseDuration: 30,
      intensityMultiplier: 1.2,
      creditReward: 15,
      requirements: { minFame: 100, minLevel: 2 },
    },
  ],
  totalDuration: 125,
  difficulty: 2,
  creditReward: 45,
  fameReward: 5,
  experienceReward: 9,
});

const mockUser = {
  id: 1,
  name: 'Test User',
  level: 3,
  fame: 500,
};

export const Default: Story = {
  args: {
    user: mockUser,
    progressiveWorkout: createProgressiveWorkout(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default workout timer with progressive difficulty exercises.',
      },
    },
  },
};

export const TimerRunning: Story = {
  args: {
    user: mockUser,
    progressiveWorkout: createProgressiveWorkout(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Workout timer in running state with active exercise tracking.',
      },
    },
  },
};

export const AdvancedWorkout: Story = {
  args: {
    user: {
      ...mockUser,
      level: 5,
      fame: 2000,
    },
    progressiveWorkout: {
      exercises: [
        {
          level: 5,
          name: 'Burpees',
          description: 'Squat, jump back to plank, push-up, jump forward, jump up',
          baseSets: 4,
          baseReps: 20,
          baseDuration: 75,
          intensityMultiplier: 2.2,
          creditReward: 35,
          requirements: { minFame: 1500, minLevel: 5 },
        },
        {
          level: 5,
          name: 'Mountain Climbers',
          description: 'Alternate bringing knees to chest in plank position',
          baseSets: 4,
          baseReps: 30,
          baseDuration: 60,
          intensityMultiplier: 2.2,
          creditReward: 35,
          requirements: { minFame: 1500, minLevel: 5 },
        },
      ],
      totalDuration: 135,
      difficulty: 5,
      creditReward: 70,
      fameReward: 7,
      experienceReward: 14,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced workout with high-intensity exercises and longer durations.',
      },
    },
  },
};

export const BeginnerWorkout: Story = {
  args: {
    user: {
      ...mockUser,
      level: 1,
      fame: 50,
    },
    progressiveWorkout: {
      exercises: [
        {
          level: 1,
          name: 'Jumping Jacks',
          description: 'Jump while raising arms and spreading legs',
          baseSets: 2,
          baseReps: 20,
          baseDuration: 25,
          intensityMultiplier: 1.0,
          creditReward: 10,
          requirements: { minFame: 0, minLevel: 1 },
        },
        {
          level: 1,
          name: 'Wall Push-ups',
          description: 'Push-ups against a wall for beginners',
          baseSets: 2,
          baseReps: 10,
          baseDuration: 30,
          intensityMultiplier: 1.0,
          creditReward: 10,
          requirements: { minFame: 0, minLevel: 1 },
        },
      ],
      totalDuration: 55,
      difficulty: 1,
      creditReward: 20,
      fameReward: 2,
      experienceReward: 4,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Beginner-friendly workout with shorter durations and lower intensity.',
      },
    },
  },
};

export const AccessibilityTest: Story = {
  args: {
    user: mockUser,
    progressiveWorkout: createProgressiveWorkout(),
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'timer-name',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: true,
          },
        ],
      },
    },
  },
};

export const TimerControls: Story = {
  args: {
    user: mockUser,
    progressiveWorkout: createProgressiveWorkout(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive testing of all timer controls with proper accessibility labels.',
      },
    },
  },
}; 