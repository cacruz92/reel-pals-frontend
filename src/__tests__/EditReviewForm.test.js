import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import EditReviewForm from '../EditReviewForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ reviewId: '1' }),
  useNavigate: () => jest.fn(),
}));

jest.mock('../api', () => ({
  getReview: jest.fn(),
  editReview: jest.fn(),
}));

describe('EditReviewForm Component', () => {
  const renderEditReviewForm = () => {
    return render(
      <MemoryRouter initialEntries={['/reviews/1/edit']}>
        <Routes>
          <Route path="/reviews/:reviewId/edit" element={<EditReviewForm />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('renders edit review form with existing review data', async () => {
    const mockReview = {
      review: {
        id: '1',
        title: 'Great Movie',
        body: 'I loved this movie!',
        rating: 5
      }
    };
    require('../api').getReview.mockResolvedValue(mockReview);

    renderEditReviewForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('Great Movie');
      expect(screen.getByLabelText(/review/i)).toHaveValue('I loved this movie!');
      expect(screen.getByLabelText(/rating/i)).toHaveValue('5');
    });
  });

  test('submits form with updated review information', async () => {
    const mockReview = {
      review: {
        id: '1',
        title: 'Great Movie',
        body: 'I loved this movie!',
        rating: 5
      }
    };
    const mockEditReview = require('../api').editReview;
    require('../api').getReview.mockResolvedValue(mockReview);
    mockEditReview.mockResolvedValue({ success: true });

    renderEditReviewForm();

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Title' } });
      fireEvent.change(screen.getByLabelText(/review/i), { target: { value: 'Updated review content' } });
      fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: '4' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /update review/i }));

    await waitFor(() => {
      expect(mockEditReview).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'Updated Title',
        body: 'Updated review content',
        rating: '4'
      }));
    });
  });
});