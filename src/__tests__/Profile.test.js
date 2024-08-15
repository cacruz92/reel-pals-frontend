import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Profile from '../Profile';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ username: 'testuser' }),
}));

const mockFindUserReviews = jest.fn();
const mockGetUserProfile = jest.fn();
const mockGetUserFollowing = jest.fn();
const mockGetLikeCount = jest.fn();

jest.mock('../api', () => ({
  findUserReviews: (...args) => mockFindUserReviews(...args),
  getUserProfile: (...args) => mockGetUserProfile(...args),
  getUserFollowing: (...args) => mockGetUserFollowing(...args),
  getLikeCount: (...args) => mockGetLikeCount(...args),
}));

const mockGetElapsedTime = jest.fn();

describe('Profile Component', () => {
  const renderProfile = (currentUser = null) => {
    return render(
      <MemoryRouter initialEntries={['/users/testuser']}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/users/:username" element={<Profile getElapsedTime={mockGetElapsedTime} />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockFindUserReviews.mockReset();
    mockGetUserProfile.mockReset();
    mockGetUserFollowing.mockReset();
    mockGetLikeCount.mockReset();
  });

  test('renders loading state', () => {
    renderProfile();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders user profile', async () => {
    const mockUser = {
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      birthday: '1990-01-02',
    };
    mockGetUserProfile.mockResolvedValue({ user: mockUser });
    mockFindUserReviews.mockResolvedValue({ reviews: [] });
    mockGetUserFollowing.mockResolvedValue([]);

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Testuser')).toBeInTheDocument();
      expect(screen.getByText(/January 1, 1990/)).toBeInTheDocument();
    });
  });

  test('renders user reviews', async () => {
    const mockUser = { username: 'testuser' };
    const mockReviews = [
      { id: 1, title: 'Great movie', movie_title: 'Test Movie', rating: 5, body: 'Loved it!', created_at: new Date().toISOString() },
    ];
    mockGetUserProfile.mockResolvedValue({ user: mockUser });
    mockFindUserReviews.mockResolvedValue({ reviews: mockReviews });
    mockGetUserFollowing.mockResolvedValue([]);
    mockGetLikeCount.mockResolvedValue(0);
    mockGetElapsedTime.mockReturnValue('1 day ago');

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('"Great movie"')).toBeInTheDocument();
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText(/Loved it!/i)).toBeInTheDocument();
      expect(screen.getByText('Posted: 1 day ago')).toBeInTheDocument();
    });
  });
});