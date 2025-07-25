import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileEditor from '../ProfileEditor';
import { trpc } from '../../lib/trpc/client';

jest.mock('../../lib/trpc/client', () => ({
  trpc: {
    user: {
      updateProfile: { useMutation: jest.fn() },
      getById: { invalidate: jest.fn() },
    },
    useContext: () => ({ user: { getById: { invalidate: jest.fn() } } }),
  },
}));

describe('ProfileEditor', () => {
  it('renders and updates profile', async () => {
    const onSocialiteNameChange = jest.fn();
    const onClose = jest.fn();
    trpc.user.updateProfile.useMutation.mockReturnValue({ mutateAsync: jest.fn().mockResolvedValue({}), isLoading: false });
    render(
      <ProfileEditor
        user={{ uid: 'test-user', name: 'Test', email: 'test@example.com' }}
        onSocialiteNameChange={onSocialiteNameChange}
        onClose={onClose}
      />
    );
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    fireEvent.change(screen.getByDisplayValue('Test'), { target: { value: 'New Name' } });
    expect(screen.getByDisplayValue('New Name')).toBeInTheDocument();
  });
});
