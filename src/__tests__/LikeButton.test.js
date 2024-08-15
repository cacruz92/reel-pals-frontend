import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../UserContext';
import LikeButton from '../LikeButton';

test('renders LikeButton component without crashing', () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <LikeButton />
        </UserProvider>
      </BrowserRouter>
    );
  });