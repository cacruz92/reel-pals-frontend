import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import MovieDetails from '../MovieDetails';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'tt1234567' }),
}));

const mockGetMovieDetails = jest.fn();
const mockGetMovieReviews = jest.fn();

jest.mock('../api', () => ({
  getMovieDetails: (...args) => mockGetMovieDetails(...args),
  getMovieReviews: (...args) => mockGetMovieReviews(...args),
}));

describe('MovieDetails Component', () => {
  const renderMovieDetails = (currentUser = null) => {
    return render(
      <MemoryRouter initialEntries={['/movie/tt1234567']}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockGetMovieDetails.mockReset();
    mockGetMovieReviews.mockReset();
  });

  test('renders loading state', () => {
    renderMovieDetails();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders movie details', async () => {
    const mockMovie = {
      Title: 'Test Movie',
      Director: 'Test Director',
      Actors: 'Actor 1, Actor 2',
      Plot: 'Test plot',
      imdbRating: '8.5',
    };
    mockGetMovieDetails.mockResolvedValue(mockMovie);
    mockGetMovieReviews.mockResolvedValue([]);

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText(/Test Director/i)).toBeInTheDocument();
      expect(screen.getByText(/Actor 1, Actor 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Test plot/i)).toBeInTheDocument();
      expect(screen.getByText(/8.5/i)).toBeInTheDocument();
    });
  });

  test('renders reviews when available', async () => {
    const mockMovie = { Title: 'Test Movie' };
    const mockReviews = [
      { id: 1, title: 'Great movie', user_username: 'user1', rating: 5, body: 'Loved it!' },
    ];
    mockGetMovieDetails.mockResolvedValue(mockMovie);
    mockGetMovieReviews.mockResolvedValue(mockReviews);

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Loved it!')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText(/Loved it!/i)).toBeInTheDocument();
    });
  });
});