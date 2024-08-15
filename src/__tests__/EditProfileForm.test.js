import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditProfileForm from '../EditProfileForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ username: 'testuser' }),
  useNavigate: () => jest.fn(),
}));

jest.mock('../api', () => ({
  getUserProfile: jest.fn(),
  verifyPassword: jest.fn(),
  updateUserProfile: jest.fn(),
}));

describe('EditProfileForm Component', () => {
  const renderEditProfileForm = () => {
    return render(
      <MemoryRouter initialEntries={['/users/testuser/edit']}>
        <Routes>
          <Route path="/users/:username/edit" element={<EditProfileForm />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('renders edit profile form', async () => {
    const mockUserProfile = {
      user: {
        firstName: 'Test',
        lastName: 'User',
        picture: 'https://example.com/pic.jpg'
      }
    };
    require('../api').getUserProfile.mockResolvedValue(mockUserProfile);

    renderEditProfileForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^current password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^confirm new password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/profile picture url/i)).toBeInTheDocument();
    });
  });

  test('submits form with updated profile information', async () => {
    const mockUserProfile = {
      user: {
        firstName: 'Test',
        lastName: 'User',
        picture: 'https://example.com/pic.jpg'
      }
    };
    const mockUpdateProfile = require('../api').updateUserProfile;
    require('../api').getUserProfile.mockResolvedValue(mockUserProfile);
    require('../api').verifyPassword.mockResolvedValue(true);
    mockUpdateProfile.mockResolvedValue({ success: true });

    renderEditProfileForm();

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Updated' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Name' } });
      fireEvent.change(screen.getByLabelText(/^current password$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: 'newpassword123' } });
      fireEvent.change(screen.getByLabelText(/^confirm new password$/i), { target: { value: 'newpassword123' } });
      fireEvent.change(screen.getByLabelText(/profile picture url/i), { target: { value: 'https://example.com/newpic.jpg' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /update profile/i }));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith('testuser', expect.objectContaining({
        firstName: 'Updated',
        lastName: 'Name',
        picture: 'https://example.com/newpic.jpg',
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      }));
    });
  });
});