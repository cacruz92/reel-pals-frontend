import React, { useEffect, useState, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import OmdbApi from "./api";
import CommentForm from "./CommentForm";
import LikeButton from "./LikeButton";
import {UserContext} from "./UserContext";
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Col,
    Row
  } from "reactstrap";

const Review = () =>{
    const {reviewId} = useParams();
    const {currentUser} = useContext(UserContext);
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
    <>
        <Card key={review.id} className="Profile-card">
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
                    </CardText>
                    <LikeButton 
                            reviewId={review.id} 
                            initialLikeCount={Number(review.likes_count)} 
                            initialIsLiked={review.is_liked_by_current_user}
                        />
                </Col>
            </Row>                                
        </Card>
        <CommentForm reviewId={review.id} onCommentAdded={handleCommentAdded} />
            <div className="comments-section">
                <h4>Comments</h4>
                {comments.map(comment => (
                    <Card key={comment.id}>
                        <CardBody>
                            <CardText>{comment.body}</CardText>
                            <small>By: {comment.username}</small>
                        </CardBody>
                    </Card>
                ))}
            </div>
    </>
)

}
export default Review;