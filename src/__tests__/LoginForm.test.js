import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import LoginForm from '../LoginForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LoginForm Component', () => {
  const mockHandleUserAuth = jest.fn();

  const renderLoginForm = () => {
    return render(
      <MemoryRouter>
        <LoginForm handleUserAuth={mockHandleUserAuth} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockHandleUserAuth.mockReset();
  });

  test('renders login form', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('submits form with user credentials', async () => {
    mockHandleUserAuth.mockResolvedValue({ success: true });

    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockHandleUserAuth).toHaveBeenCalledWith(
        { username: 'testuser', password: 'password123' },
        'login'
      );
    });
  });

});