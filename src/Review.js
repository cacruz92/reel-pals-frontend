import React, { useEffect, useState, useContext } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import OmdbApi from "./api";
import CommentForm from "./CommentForm";
import LikeButton from "./LikeButton";
import {UserContext} from "./UserContext";
import "./styles/Review.css"
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Col,
    Row,
    Container,
    Button
  } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';




const Review = ({getElapsedTime}) =>{
    const {reviewId} = useParams();
    const {currentUser} = useContext(UserContext);
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getReviewData = async () => {
        try {
            const res = await OmdbApi.getReview(reviewId);
            setReview(res.review);
            setComments(res.review.comments || []);
            setIsLoading(false);
        } catch(e){
            console.error("Error fetching review details:", e);
            setError(`Failed to load review details. Please try again. ${e.message}`);
            setIsLoading(false);
        }
    };
    getReviewData();
}, [reviewId]);

const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
}

const handleCommentDelete = async (commentId) => {
    try {
        await OmdbApi.deleteComment(reviewId, commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
    } catch (e) {
        console.error("Error deleting comment:", e);
    }
}

const handleReviewDelete = async () => {
    try {
        await OmdbApi.removeReview(reviewId);
        navigate('/');
    } catch (e) {
        console.error("Error deleting review:", e);
        setError("Failed to delete review. Please try again.");
    }
}

if(isLoading){
    return <div><h1>Loading...</h1></div>
}
if(error){
    return <div> <h1> {error} </h1></div>
}

if (!review) {
    return <div><h1>Review not found</h1></div>
}

return(
    <div className="Review">
        <Container>
        <Card key={review.id} className="Review-card">
            <CardBody>
            {currentUser && currentUser.username === review.user_username && (
                    <>
                    <Button 
                        color="primary" 
                        size="sm" 
                        className="edit-review-btn"
                        onClick={() => navigate(`/reviews/${review.id}/edit`)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button 
                        id="deleteReviewBtn"
                        color="danger" 
                        size="sm" 
                        className="delete-review-btn"
                        onClick={handleReviewDelete}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                    </>
                )}

            <Row>
                <Col xs="3"> 
                    {review.poster && <img src={review.poster} alt={`${review.movie_title} poster`} className="Review-poster" />}
                </Col> 
                <Col xs="9">
                    <CardTitle tag="h3">
                        <NavLink to={`/movie/${review.movie_imdb_id}`}>{review.movie_title}</NavLink>
                    </CardTitle>
                    <CardTitle tag="h4">{review.title}</CardTitle>
                    <CardText>
                        <p>{review.rating}/5</p>
                        <p>{review.body}</p>
                        <p>Posted: {getElapsedTime(review.created_at)}</p>
                    </CardText>
                    <LikeButton 
                            reviewId={review.id} 
                            initialLikeCount={Number(review.likes_count)} 
                            initialIsLiked={review.is_liked_by_current_user}
                        />
                </Col>
            </Row>    
            </CardBody>                            
        </Card>
        <div className="CommentForm">
            <CommentForm reviewId={review.id} onCommentAdded={handleCommentAdded} />
        </div>
            <div className="comments-section">
                <h4>Comments</h4>
                {comments.map(comment => (
                    <Card key={comment.id}>
                        <CardBody>
                            <CardText>{comment.body}</CardText>
                            <small> {comment.user_username} • {getElapsedTime(comment.created_at)} </small>
                            {currentUser && currentUser.username === comment.user_username && (
                                    <Button 
                                        color="danger" 
                                        size="sm" 
                                        className="float-right"
                                        onClick={() => handleCommentDelete(comment.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                )}
                        </CardBody>
                    </Card>
                ))}
            </div>
            </Container>
    </div>
)

}
export default Review;