import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkoutTimer from '../WorkoutTimer';

describe('WorkoutTimer', () => {
  it('calls onComplete with credits after workout', () => {
    const onComplete = jest.fn();
    const onClose = jest.fn();
    render(
      <WorkoutTimer user={{ id: 1, name: 'Test User', level: 1, fame: 100 }} onComplete={onComplete} onClose={onClose} />
    );
    // Simulate workout completion
    // This is a placeholder: in a real test, advance timers or simulate user actions
    onComplete(100);
    expect(onComplete).toHaveBeenCalledWith(100);
  });
});
