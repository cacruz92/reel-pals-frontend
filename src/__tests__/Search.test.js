import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Search from '../Search';

const mockSearchMovies = jest.fn();
const mockSearchByUser = jest.fn();

jest.mock('../api', () => ({
  searchMovies: (...args) => mockSearchMovies(...args),
  searchByUser: (...args) => mockSearchByUser(...args),
}));

describe('Search Component', () => {
  const renderSearch = () => {
    return render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockSearchMovies.mockReset();
    mockSearchByUser.mockReset();
  });

  test('renders search form', () => {
    renderSearch();
    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('performs movie search', async () => {
    mockSearchMovies.mockResolvedValue({ Search: [{ Title: 'Test Movie', Year: '2021', imdbID: 'tt1234567' }] });

    renderSearch();

    fireEvent.change(screen.getByPlaceholderText(/Search.../i), { target: { value: 'Test Movie' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockSearchMovies).toHaveBeenCalledWith('Test Movie', '');
      expect(screen.getByText('Test Movie (2021)')).toBeInTheDocument();
    });
  });

  test('performs user search', async () => {
    mockSearchByUser.mockResolvedValue({ users: [{ username: 'testuser' }] });

    renderSearch();

    fireEvent.change(screen.getByPlaceholderText(/Search.../i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'users' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockSearchByUser).toHaveBeenCalledWith('testuser');
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });
  });

  test('displays no results message', async () => {
    mockSearchMovies.mockResolvedValue({});

    renderSearch();

    fireEvent.change(screen.getByPlaceholderText(/Search.../i), { target: { value: 'Nonexistent Movie' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    });
  });
});