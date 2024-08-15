import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../UserContext';
import NavBar from '../NavBar';

test('renders NavBar component without crashing', () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <NavBar />
        </UserProvider>
      </BrowserRouter>
    );
  });