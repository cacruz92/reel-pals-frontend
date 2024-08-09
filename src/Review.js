import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import OmdbApi from "./api";
import UserContext from "./UserContext";

const Review = () =>{
    const {reviewId} = useParams();
    const [review, setReview] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getReview = async () => {
        try {
            const res = await OmdbApi.getReview(reviewId);
            setReview(res);
            setIsLoading(false);
        } catch(e){
            console.error("Error fetching review details:", e);
            setError(`Failed to load review details. Please try again. ${e.message}`);
            setIsLoading(false);
        }
    };
    getReview();
}, [reviewId]);

if(isLoading){
    return <div><h1>Loading...</h1></div>
}
if(error){
    return <div> <h1> {error} </h1></div>
}

return(
    <>
        <Card key={review.id} className="Profile-card">
            <Row>
                <Col xs="3"> 
                    <img src={review.poster} alt={`${review.movie_title} poster`} className="Review-poster" />
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
                </Col>
            </Row>
                                    
        </Card>
    </>
)

}
export default Review;