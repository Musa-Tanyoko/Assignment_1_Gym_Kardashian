import type { Meta, StoryObj } from '@storybook/react';
import SocialiteCard from './SocialiteCard';
import { SocialiteStats } from '../types/socialite';

const meta: Meta<typeof SocialiteCard> = {
  title: 'Components/SocialiteCard',
  component: SocialiteCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive socialite management card that displays stats, needs, and provides interaction buttons. Features progressive difficulty and accessibility compliance.',
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
            id: 'form-field-multiple-labels',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    onFeed: { action: 'feed clicked' },
    onClean: { action: 'clean clicked' },
    onPlay: { action: 'play clicked' },
    credits: {
      control: { type: 'range', min: 0, max: 1000, step: 10 },
      description: 'Available credits for actions',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample socialite data for different states
const createSocialite = (overrides: Partial<SocialiteStats> = {}): SocialiteStats => ({
  id: 1,
  name: 'Kim Kardashian',
  type: 'influencer',
  level: 3,
  age: 30,
  fame: 500,
  experience: 150,
  hunger: 75,
  hygiene: 80,
  happiness: 90,
  spa: 60,
  glam: 70,
  outfits: 85,
  photoshoots: 50,
  trips: 40,
  posts: 65,
  wellness: 55,
  petcare: 45,
  events: 75,
  pr: 80,
  totalWorkouts: 25,
  totalCreditsEarned: 500,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  ...overrides,
});

export const Default: Story = {
  args: {
    socialite: createSocialite(),
    credits: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default socialite card with balanced stats and full credit availability.',
      },
    },
  },
};

export const LowNeeds: Story = {
  args: {
    socialite: createSocialite({
      hunger: 20,
      hygiene: 15,
      happiness: 25,
    }),
    credits: 50,
  },
  parameters: {
    docs: {
      description: {
        story: 'Socialite with low needs showing red warning colors and disabled states.',
      },
    },
  },
};

export const HighLevelCelebrity: Story = {
  args: {
    socialite: createSocialite({
      name: 'Beyoncé',
      type: 'celebrity',
      level: 5,
      fame: 2500,
      experience: 500,
      totalWorkouts: 100,
    }),
    credits: 200,
  },
  parameters: {
    docs: {
      description: {
        story: 'High-level celebrity with advanced stats and progression indicators.',
      },
    },
  },
};

export const InsufficientCredits: Story = {
  args: {
    socialite: createSocialite(),
    credits: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates button disabled states when credits are insufficient for actions.',
      },
    },
  },
};

export const NameEditing: Story = {
  args: {
    socialite: createSocialite({ name: 'Edit Me' }),
    credits: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the interactive name editing feature with proper form controls.',
      },
    },
  },
};

export const MaxLevelIcon: Story = {
  args: {
    socialite: createSocialite({
      name: 'Oprah Winfrey',
      type: 'icon',
      level: 6,
      fame: 6000,
      experience: 1000,
      totalWorkouts: 200,
    }),
    credits: 500,
  },
  parameters: {
    docs: {
      description: {
        story: 'Maximum level cultural icon showing the pinnacle of socialite progression.',
      },
    },
  },
};

export const AccessibilityTest: Story = {
  args: {
    socialite: createSocialite(),
    credits: 100,
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
            id: 'form-field-multiple-labels',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: true,
          },
          {
            id: 'page-has-heading-one',
            enabled: true,
          },
        ],
      },
    },
  },
}; 