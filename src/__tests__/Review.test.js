import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Review from '../Review';

const mockGetReview = jest.fn();
const mockDeleteComment = jest.fn();
const mockRemoveReview = jest.fn();

jest.mock('../api', () => ({
  getReview: (...args) => mockGetReview(...args),
  deleteComment: (...args) => mockDeleteComment(...args),
  removeReview: (...args) => mockRemoveReview(...args),
}));

const mockGetElapsedTime = jest.fn();

describe('Review Component', () => {
  const renderReview = (currentUser = null) => {
    return render(
      <MemoryRouter initialEntries={['/reviews/1']}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/reviews/:reviewId" element={<Review getElapsedTime={mockGetElapsedTime} />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockGetReview.mockReset();
    mockDeleteComment.mockReset();
    mockRemoveReview.mockReset();
    mockGetElapsedTime.mockReturnValue('1 day ago');
  });

  test('renders review details', async () => {
    const mockReview = {
      id: 1,
      title: 'Great Movie',
      movie_title: 'Test Movie',
      user_username: 'testuser',
      rating: 5,
      body: 'Loved it!',
      created_at: new Date().toISOString(),
      comments: [],
    };
    mockGetReview.mockResolvedValue({ review: mockReview });

    renderReview();

    await waitFor(() => {
      expect(screen.getByText('Great Movie')).toBeInTheDocument();
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText('Loved it!')).toBeInTheDocument();
      expect(screen.getByText('5/5')).toBeInTheDocument();
      expect(screen.getByText(/Posted:/)).toBeInTheDocument();
    });
  });

  test('renders comments', async () => {
    const mockReview = {
      id: 1,
      title: 'Great Movie',
      comments: [
        { id: 1, body: 'Nice review!', user_username: 'commenter', created_at: new Date().toISOString() },
      ],
    };
    mockGetReview.mockResolvedValue({ review: mockReview });

    renderReview();

    await waitFor(() => {
      expect(screen.getByText('Nice review!')).toBeInTheDocument();
      expect(screen.getByText(/commenter/)).toBeInTheDocument();
    });
  });

  test('allows comment deletion for comment author', async () => {
    const mockReview = {
      id: 1,
      title: 'Great Movie',
      comments: [
        { id: 1, body: 'Nice review!', user_username: 'currentuser', created_at: new Date().toISOString() },
      ],
    };
    mockGetReview.mockResolvedValue({ review: mockReview });

    renderReview({ username: 'currentuser' });

    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: '' });
      expect(deleteButton).toBeInTheDocument();
      fireEvent.click(deleteButton);
      expect(mockDeleteComment).toHaveBeenCalledWith('1', 1);
    });
  });
});