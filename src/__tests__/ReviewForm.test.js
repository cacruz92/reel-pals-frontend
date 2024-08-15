import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../UserContext';
import ReviewForm from '../ReviewForm';

jest.mock('react-icons/fa', () => ({
  FaStar: () => <span data-testid="star-icon" />,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockAddReview = jest.fn();

jest.mock('../api', () => ({
  addReview: (...args) => mockAddReview(...args),
}));

describe('ReviewForm Component', () => {
  const renderReviewForm = (currentUser = null) => {
    return render(
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser }}>
          <ReviewForm movie_imdb_id="tt1234567" poster="poster_url" />
        </UserContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockAddReview.mockReset();
  });

  test('renders review form', () => {
    renderReviewForm({ username: 'testuser' });
    expect(screen.getByText(/write a review for this movie/i)).toBeInTheDocument();
    expect(screen.getByText(/rating:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body:/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('star-icon')).toHaveLength(5);
  });

  test('submits review when form is filled', async () => {
    renderReviewForm({ username: 'testuser' });

    const stars = screen.getAllByTestId('star-icon');
    fireEvent.click(stars[4]); // 5-star rating
    fireEvent.change(screen.getByLabelText(/title:/i), { target: { value: 'Great Movie' } });
    fireEvent.change(screen.getByLabelText(/body:/i), { target: { value: 'I loved this movie!' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockAddReview).toHaveBeenCalledWith({
        rating: 5,
        title: 'Great Movie',
        body: 'I loved this movie!',
        movie_imdb_id: 'tt1234567',
        username: 'testuser',
        poster: 'poster_url'
      });
    });
  });

  test('displays error when user is not logged in', async () => {
    renderReviewForm();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/You must be logged in to submit a review/i)).toBeInTheDocument();
    });
  });
});