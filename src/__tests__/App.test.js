import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../UserContext';
import App from '../App';

jest.mock('../Home', () => () => <div data-testid="mock-home">Home</div>);
jest.mock('../NavBar', () => () => <div data-testid="mock-navbar">NavBar</div>);
jest.mock('../Search', () => () => <div data-testid="mock-search">Search</div>);
jest.mock('../Profile', () => () => <div data-testid="mock-profile">Profile</div>);
jest.mock('../LoginForm', () => () => <div data-testid="mock-login">Login</div>);
jest.mock('../SignUpForm', () => () => <div data-testid="mock-signup">Signup</div>);
jest.mock('../MovieDetails', () => () => <div data-testid="mock-movie-details">Movie Details</div>);
jest.mock('../Review', () => () => <div data-testid="mock-review">Review</div>);
jest.mock('../EditProfileForm', () => () => <div data-testid="mock-edit-profile">Edit Profile</div>);
jest.mock('../ReviewForm', () => () => <div data-testid="mock-review-form">Review Form</div>);
jest.mock('../EditReviewForm', () => () => <div data-testid="mock-edit-review">Edit Review</div>);

test('renders App component without crashing', () => {
  render(
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  );

  expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();

});

test('renders Home component without crashing', () => {
  render(
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  );
  expect(screen.getByTestId('mock-home')).toBeInTheDocument();
});






  


