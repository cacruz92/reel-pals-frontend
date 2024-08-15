import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import SearchResults from '../SearchResults';

describe('SearchResults Component', () => {
  const renderSearchResults = (props) => {
    return render(
      <MemoryRouter>
        <SearchResults {...props} />
      </MemoryRouter>
    );
  };

  test('renders message when no search has been performed', () => {
    renderSearchResults({ results: [], error: null, category: '', hasSearched: false });
    expect(screen.getByText(/Search for your favorite movies or users/i)).toBeInTheDocument();
  });

  test('renders error message when there is an error', () => {
    renderSearchResults({ results: [], error: 'Search failed', category: 'movies', hasSearched: true });
    expect(screen.getByText(/Search failed/i)).toBeInTheDocument();
  });

  test('renders no results message when search yields no results', () => {
    renderSearchResults({ results: [], error: null, category: 'movies', hasSearched: true });
    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  });

  test('renders movie results', () => {
    const movieResults = [
      { imdbID: '1', Title: 'Test Movie', Year: '2021' }
    ];
    renderSearchResults({ results: movieResults, error: null, category: 'movies', hasSearched: true });
    expect(screen.getByText('Test Movie (2021)')).toBeInTheDocument();
  });

  test('renders user results', () => {
    const userResults = [
      { username: 'testuser' }
    ];
    renderSearchResults({ results: userResults, error: null, category: 'users', hasSearched: true });
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });
});