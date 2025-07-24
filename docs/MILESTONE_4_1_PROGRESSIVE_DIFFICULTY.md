# Milestone 4.1: Progressive Difficulty Implementation

## Overview
This milestone implements the progressive difficulty system for the socialite/avatar, where fame and demands increase over time, leading to more intense exercises and higher credit requirements.

## Key Features Implemented

### 1. Fame Level Progression System
- **6 Fame Levels**: From Micro Influencer to Cultural Icon
- **Progressive Demands**: Each level has increased needs depletion rates
- **Credit Multipliers**: Higher fame levels provide better credit rewards
- **Exercise Intensity Scaling**: Workout difficulty increases with fame level

### 2. Exercise Difficulty Scaling
- **6 Difficulty Levels**: From Beginner to Legendary
- **Dynamic Requirements**: Minimum fame and level requirements for each difficulty
- **Progressive Workouts**: Exercise sets, reps, and duration scale with difficulty
- **Intensity Multipliers**: Each difficulty level has a specific intensity multiplier

### 3. Socialite Growth Mechanics
- **Fame Accumulation**: Earn fame through workouts and luxury activities
- **Level Progression**: Socialite levels up based on fame thresholds
- **Increased Demands**: Higher levels require more frequent care and luxury items
- **Credit Scaling**: More credits needed for higher-level socialite needs

## Technical Implementation

### Core Types (`apps/web/src/types/socialite.ts`)

#### SocialiteStats Interface
```typescript
interface SocialiteStats {
  id: number;
  name: string;
  type: SocialiteType;
  level: number;
  age: number;
  fame: number;
  experience: number;
  
  // Basic needs (deplete over time)
  hunger: number;
  hygiene: number;
  happiness: number;
  
  // Luxury needs (socialite specific)
  spa: number;
  glam: number;
  outfits: number;
  photoshoots: number;
  trips: number;
  posts: number;
  wellness: number;
  petcare: number;
  events: number;
  pr: number;
  
  // Progression tracking
  totalWorkouts: number;
  totalCreditsEarned: number;
  lastWorkoutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Fame Level System
```typescript
interface FameLevel {
  level: number;
  name: string;
  fameRequired: number;
  type: SocialiteType;
  emoji: string;
  description: string;
  needsMultiplier: number;
  exerciseIntensityMultiplier: number;
  creditMultiplier: number;
  demands: SocialiteDemands;
}
```

#### Exercise Difficulty System
```typescript
interface ExerciseDifficulty {
  level: number;
  name: string;
  description: string;
  baseSets: number;
  baseReps: number;
  baseDuration: number;
  intensityMultiplier: number;
  creditReward: number;
  requirements: {
    minFame: number;
    minLevel: number;
  };
}
```

### Fame Level Progression

| Level | Name | Fame Required | Type | Description |
|-------|------|---------------|------|-------------|
| 1 | Micro Influencer | 0 | influencer | Just starting out in social media |
| 2 | Rising Star | 200 | influencer | Gaining followers and brand attention |
| 3 | Celebrity | 500 | celebrity | Recognized in public, paparazzi attention |
| 4 | A-List Star | 1000 | celebrity | Household name, major brand deals |
| 5 | Business Mogul | 2000 | mogul | Building empires, multiple revenue streams |
| 6 | Cultural Icon | 5000 | icon | Legendary status, influence beyond entertainment |

### Exercise Difficulty Levels

| Level | Name | Min Fame | Min Level | Intensity | Base Reward |
|-------|------|----------|-----------|-----------|-------------|
| 1 | Beginner | 0 | 1 | 1.0x | 10 credits |
| 2 | Novice | 100 | 2 | 1.2x | 15 credits |
| 3 | Intermediate | 300 | 3 | 1.5x | 20 credits |
| 4 | Advanced | 800 | 4 | 1.8x | 25 credits |
| 5 | Elite | 1500 | 5 | 2.2x | 35 credits |
| 6 | Legendary | 3000 | 6 | 2.5x | 50 credits |

### Progressive Difficulty Hook (`apps/web/src/hooks/useProgressiveDifficulty.ts`)

The hook manages the entire progressive difficulty system:

- **State Management**: Tracks socialite stats, fame levels, and exercise difficulty
- **Automatic Updates**: Simulates needs depletion over time
- **Level Progression**: Handles fame level upgrades and notifications
- **Workout Generation**: Creates progressive workouts based on current stats
- **Progress Tracking**: Calculates progress to next levels

### Key Functions

#### `getCurrentFameLevel(fame: number)`
Returns the current fame level based on fame points.

#### `getExerciseDifficulty(socialiteLevel: number, fame: number)`
Returns the appropriate exercise difficulty based on socialite level and fame.

#### `calculateProgressiveWorkout(socialite: SocialiteStats)`
Generates a workout with exercises scaled to the current difficulty level.

#### `calculateNeedsDepletion(socialite: SocialiteStats, hoursPassed: number)`
Calculates how much the socialite's needs have depleted over time.

## UI Components Updated

### 1. PetCard Component
- Added fame progress bar
- Shows current fame level and next level requirements
- Displays experience and workout statistics
- Visual indicators for progression

### 2. Dashboard Component
- Integrated progressive difficulty hook
- Added progressive difficulty status section
- Updated workout section to show current difficulty
- Enhanced socialite actions with progressive scaling

### 3. WorkoutTimer Component
- Updated to use progressive workout data
- Shows scaled exercise parameters (sets, reps, duration)
- Displays difficulty-based credit rewards

### 4. ProgressiveDifficultyDemo Component
- Interactive demo showcasing the progression system
- Real-time updates as fame and levels change
- Visual representation of all fame levels and difficulties
- Sample progressive workout generation

## Progressive Scaling Examples

### Exercise Scaling (Push-ups)
- **Level 1**: 2 sets × 8 reps (30s duration)
- **Level 2**: 3 sets × 10 reps (40s duration)
- **Level 3**: 3 sets × 12 reps (45s duration)
- **Level 4**: 4 sets × 15 reps (60s duration)
- **Level 5**: 4 sets × 20 reps (75s duration)
- **Level 6**: 5 sets × 25 reps (90s duration)

### Needs Depletion Rates
- **Level 1**: 2% per hour (basic), 1% per hour (luxury)
- **Level 3**: 3% per hour (basic), 2% per hour (luxury)
- **Level 6**: 5% per hour (basic), 4% per hour (luxury)

### Credit Rewards
- **Level 1**: Base reward × 1.0x multiplier
- **Level 3**: Base reward × 1.3x multiplier
- **Level 6**: Base reward × 2.0x multiplier

## Benefits of the Progressive System

1. **Engagement**: Players are motivated to continue working out to maintain their socialite's status
2. **Challenge**: Exercise intensity increases naturally, preventing plateau
3. **Progression**: Clear goals and milestones keep users engaged
4. **Scaling**: System adapts to different player skill levels
5. **Rewards**: Higher fame levels provide better rewards, creating positive feedback loops

## Future Enhancements

1. **Multiple Socialites**: Allow players to manage multiple socialites with different progression paths
2. **Special Events**: Fame-based events that provide bonus rewards
3. **Social Features**: Compare progress with friends
4. **Achievement System**: Milestone rewards for reaching new fame levels
5. **Customization**: Allow players to choose different progression paths

## Testing

The progressive difficulty system can be tested through:

1. **Progressive Demo**: Interactive demo page showing real-time progression
2. **Dashboard Integration**: Full integration in the main dashboard
3. **Workout Timer**: Progressive workouts with scaled difficulty
4. **Socialite Actions**: Fame-gaining activities that trigger progression

## Conclusion

The progressive difficulty system successfully implements milestone 4.1 by creating a dynamic, engaging progression system that scales exercise intensity with socialite fame and demands. The system provides clear progression paths, meaningful rewards, and keeps users motivated through increasing challenges and benefits. 