

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Feed from '../Feed';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

const mockGetUserFeed = jest.fn();
const mockGetLikeCount = jest.fn();

jest.mock('../api', () => ({
  getUserFeed: (...args) => mockGetUserFeed(...args),
  getLikeCount: (...args) => mockGetLikeCount(...args),
}));

const mockGetElapsedTime = jest.fn();

describe('Feed Component', () => {
  const renderFeed = (currentUser = null) => {
    return render(
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser }}>
          <Feed getElapsedTime={mockGetElapsedTime} />
        </UserContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockGetUserFeed.mockReset();
    mockGetLikeCount.mockReset();
  });

  test('renders welcome message when user is not logged in', () => {
    renderFeed();
    expect(screen.getByText(/Welcome to Reel Pals/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
  });

  test('renders loading state when user is logged in', async () => {
    mockGetUserFeed.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 200)));
    
    renderFeed({ username: 'testuser' });
    
    expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders empty feed message when user is logged in but feed is empty', async () => {
    mockGetUserFeed.mockResolvedValue([]);
    
    renderFeed({ username: 'testuser' });
    
    await waitFor(() => {
      expect(screen.getByText(/Your feed is currently empty/i)).toBeInTheDocument();
    });
  });

  test('renders feed items when user is logged in and feed has items', async () => {
    const mockFeedItems = [
      { id: 1, title: 'Test Review', user_username: 'user1', rating: 5, body: 'Great movie!', created_at: new Date().toISOString() }
    ];
    mockGetUserFeed.mockResolvedValue(mockFeedItems);
    mockGetLikeCount.mockResolvedValue(0);

    renderFeed({ username: 'testuser' });

    await waitFor(() => {
      expect(screen.getByText(/Test Review/i)).toBeInTheDocument();
      expect(screen.getByText(/user1/i)).toBeInTheDocument();
      expect(screen.getByText(/Great movie!/i)).toBeInTheDocument();
    });
  });
});