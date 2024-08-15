import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./styles/EditReviewForm.css"
import { 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    Button, 
    Container, 
    Card, 
    CardBody } from 'reactstrap';
import OmdbApi from './api';
import { FaStar } from "react-icons/fa";
const EditReviewForm = () => {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        rating: ''
    });
    const [error, setError] = useState(null);
    const [hover, setHover] = useState(null);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await OmdbApi.getReview(reviewId);
                setFormData({
                    title: res.review.title,
                    body: res.review.body,
                    rating: res.review.rating
                });
            } catch (e) {
                console.error("Error fetching review:", e);
                setError("Failed to load review. Please try again.");
            }
        };
        fetchReview();
    }, [reviewId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    };

    const handleRatingChange = (ratingValue) => {
        setFormData(formData => ({
            ...formData,
            rating: ratingValue
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await OmdbApi.editReview(reviewId, formData);
            navigate(`/reviews/${reviewId}`);
        } catch (e) {
            console.error("Error updating review:", e);
            setError("Failed to update review. Please try again.");
        }
    };

    if (error) return <div>{error}</div>;

    return (
        <div className="EditReviewForm">
            <Container>
                <Card className="edit-card">
                    <CardBody>
                        <h2 className="text-center mb-4">Edit Review</h2>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="body">Review</Label>
                                <Input
                                    type="textarea"
                                    name="body"
                                    id="body"
                                    value={formData.body}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="rating">Rating</Label>
                                <Input
                                    type="select"
                                    name="rating"
                                    id="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select rating</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Input>
                            </FormGroup>
                            <Button color="primary" type="submit" className="submit-btn">Update Review</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </div>
        
    );
};

export default EditReviewForm;