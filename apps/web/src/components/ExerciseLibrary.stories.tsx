import type { Meta, StoryObj } from '@storybook/react';
import ExerciseLibrary from './ExerciseLibrary';

const meta: Meta<typeof ExerciseLibrary> = {
  title: 'Components/ExerciseLibrary',
  component: ExerciseLibrary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive exercise library with filtering, search, and detailed exercise information. Features accessibility compliance and progressive difficulty indicators.',
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
            id: 'list',
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
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default exercise library view showing all available exercises with filtering options.',
      },
    },
  },
};

export const AccessibilityTest: Story = {
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
            id: 'list',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: true,
          },
          {
            id: 'heading-order',
            enabled: true,
          },
        ],
      },
    },
  },
};

export const CategoryFiltering: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates category filtering functionality with proper state management.',
      },
    },
  },
};

export const DifficultyFiltering: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows difficulty-based filtering with visual indicators.',
      },
    },
  },
};

export const SearchFunctionality: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive search functionality with real-time filtering.',
      },
    },
  },
}; 