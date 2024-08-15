// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the OmdbApi

jest.mock('./api', () => ({
    default: {
      omdbRequest: jest.fn(),
      authRequest: jest.fn(),
      searchMovies: jest.fn(),
      getMovieDetails: jest.fn(),
      addMovie: jest.fn(),
      register: jest.fn(),
      login: jest.fn(),
      getCurrentUser: jest.fn(),
      getUserProfile: jest.fn(),
      verifyPassword: jest.fn(),
      updateUserProfile: jest.fn(),
      removeUser: jest.fn(),
      searchByUser: jest.fn(),
      followUser: jest.fn(),
      unfollowUser: jest.fn(),
      getUserFollowers: jest.fn(),
      getUserFollowing: jest.fn(),
      addReview: jest.fn(),
      editReview: jest.fn(),
      removeReview: jest.fn(),
      findUserReviews: jest.fn(),
      getMovieReviews: jest.fn(),
      getReview: jest.fn(),
      addComment: jest.fn(),
      removeComment: jest.fn(),
      getUserFeed: jest.fn(),
      editComment: jest.fn(),
      deleteComment: jest.fn(),
      findReviewComments: jest.fn(),
      addLike: jest.fn(),
      removeLike: jest.fn(),
      getLikeCount: jest.fn(),
    }
  }));

  // Mock localStorage
    const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn()
    };
    global.localStorage = localStorageMock;

    // Mock window.alert
    global.alert = jest.fn();

    // Mock console methods to prevent cluttering the test output
    global.console = {
        ...console,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };