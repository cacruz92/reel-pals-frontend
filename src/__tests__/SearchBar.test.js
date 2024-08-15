import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  const renderSearchBar = () => {
    return render(<SearchBar onSearch={mockOnSearch} />);
  };

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search bar', () => {
    renderSearchBar();
    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('calls onSearch with correct parameters when form is submitted', () => {
    renderSearchBar();
    
    fireEvent.change(screen.getByPlaceholderText(/Search.../i), { target: { value: 'test query' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'users' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mockOnSearch).toHaveBeenCalledWith('test query', '', 'users');
  });

  test('updates search term when input changes', () => {
    renderSearchBar();
    
    const searchInput = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(searchInput, { target: { value: 'new search' } });
    
    expect(searchInput.value).toBe('new search');
  });

  test('updates category when select changes', () => {
    renderSearchBar();
    
    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'users' } });
    
    expect(categorySelect.value).toBe('users');
  });
});