import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import SignUpForm from '../SignUpForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('SignUpForm Component', () => {
  const mockHandleUserAuth = jest.fn();

  const renderSignUpForm = () => {
    return render(
      <MemoryRouter>
        <SignUpForm handleUserAuth={mockHandleUserAuth} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockHandleUserAuth.mockReset();
  });

  test('renders signup form', () => {
    renderSignUpForm();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/birthday/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile picture url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('submits form with user information', async () => {
    mockHandleUserAuth.mockResolvedValue({ success: true });

    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/birthday/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/profile picture url/i), { target: { value: 'https://example.com/pic.jpg' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockHandleUserAuth).toHaveBeenCalledWith(
        {
          username: 'testuser',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          birthday: '1990-01-01',
          picture: 'https://example.com/pic.jpg'
        },
        'register'
      );
    });
  });



});