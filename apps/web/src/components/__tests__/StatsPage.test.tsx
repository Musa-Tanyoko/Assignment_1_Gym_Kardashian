import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StatsPage from '../StatsPage';
import { trpc } from '../../lib/trpc/client';

jest.mock('../../lib/trpc/client', () => ({
  trpc: {
    workout: {
      getStats: { useQuery: jest.fn() },
      getCredits: { useQuery: jest.fn() },
    },
    user: {
      importActivityLogs: { useMutation: jest.fn() },
    },
  },
}));

describe('StatsPage', () => {
  it('renders stats and credits', async () => {
    trpc.workout.getStats.useQuery.mockReturnValue({ data: { steps: 1000, exercisesCompleted: 5, streak: 2, sessions: 3, hours: 1.5 } });
    trpc.workout.getCredits.useQuery.mockReturnValue({ data: { credits: 200 } });
    trpc.user.importActivityLogs.useMutation.mockReturnValue({ mutateAsync: jest.fn() });

    render(<StatsPage user={{ uid: 'test-user' }} />);
    await waitFor(() => expect(screen.getByText(/Credits:/)).toBeInTheDocument());
    expect(screen.getByText(/Credits: 200/)).toBeInTheDocument();
    expect(screen.getByText(/steps: 1000/i)).toBeInTheDocument();
    expect(screen.getByText(/exercisesCompleted: 5/i)).toBeInTheDocument();
    expect(screen.getByText(/streak: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/sessions: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/hours: 1.5/i)).toBeInTheDocument();
  });
});
