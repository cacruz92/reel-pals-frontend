import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../UserContext';
import Home from '../Home';

test('renders Home component without crashing', () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Home />
        </UserProvider>
      </BrowserRouter>
    );
  });