import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import CommentForm from '../CommentForm';

jest.mock('../api', () => ({
  addComment: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CommentForm Component', () => {
  const mockOnCommentAdded = jest.fn();

  const renderCommentForm = (currentUser = null) => {
    return render(
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser }}>
          <CommentForm reviewId="1" onCommentAdded={mockOnCommentAdded} />
        </UserContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders comment form when user is logged in', () => {
    renderCommentForm({ username: 'testuser' });
    expect(screen.getByLabelText(/leave a comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('does not render form when user is not logged in', () => {
    renderCommentForm();
    expect(screen.queryByLabelText(/leave a comment/i)).not.toBeInTheDocument();
  });

  test('submits comment when form is filled', async () => {
    const mockAddComment = require('../api').addComment;
    mockAddComment.mockResolvedValue({ id: '1', body: 'Test comment' });

    renderCommentForm({ username: 'testuser' });
    
    fireEvent.change(screen.getByLabelText(/leave a comment/i), { target: { value: 'Test comment' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith('1', 'Test comment');
      expect(mockOnCommentAdded).toHaveBeenCalledWith({ id: '1', body: 'Test comment' });
    });
  });
});