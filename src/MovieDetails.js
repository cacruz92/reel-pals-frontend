import React, {useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import OmdbApi from "./api";
import ReviewForm from "./ReviewForm";
import "./styles/MovieDetails.css"
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Container,
    Row,
    Col
  } from "reactstrap";

const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try{
                const result = await OmdbApi.getMovieDetails(id);
                setMovie(result);

                const movieReviews = await OmdbApi.getMovieReviews(id);
                setReviews(movieReviews);

                setIsLoading(false);
            } catch(e){
                console.error("Error fetching movie details:", e);
                setError(`Failed to load movie details. Please try again. ${e.message}`);
                setIsLoading(false);
            }
        };
        fetchMovieDetails();
    },[id]);

    if(isLoading){
        return <div><h1>Loading...</h1></div>
    }
    if(error){
        return <div> <h1> {error} </h1></div>
    }

    return(
        <><Container className="MovieDetails">
        <Card className="MovieDetails-card">
            <CardBody>
                <Row>
                    <Col md="4">
                        <img src={movie.Poster} alt={`${movie.Title}'s poster`} className="img-fluid mb-3" />
                    </Col>
                    <Col md="8">
                        <CardTitle tag="h1">{movie.Title}</CardTitle>
                        <CardText>
                            <p><strong>Director:</strong> {movie.Director}</p>
                            <p><strong>Actors:</strong> {movie.Actors}</p>
                            <p><strong>Plot:</strong> {movie.Plot}</p>
                            <p><strong>Genre:</strong> {movie.Genre}</p>
                            <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
                            <p><strong>Runtime:</strong> {movie.Runtime}</p>
                            <p><strong>Released:</strong> {movie.Released}</p>
                            <p><strong>Awards:</strong> {movie.Awards}</p>
                        </CardText>  
                    </Col>
                </Row> 
            </CardBody>
        </Card>
                    
        <Card className="MovieDetails-review-form">
            <CardBody>
                <ReviewForm movie_imdb_id={movie.imdbID} poster={movie.Poster} />
            </CardBody>
        </Card>
        </Container>  
        <Container className="MovieDetails">
        <Card className="MovieDetails-card">
            <CardBody>
                <CardTitle tag="h2">Reviews</CardTitle>
                
                {reviews.length === 0 ? (
                    <CardText>No reviews yet. Be the first to review!</CardText>
                ) : (
                    reviews.map(review => (
                        <Card key={review.id} className="mb-3">
                            <hr></hr>
                            <CardBody>
                                <CardTitle tag="h2">"{review.title}"</CardTitle>
                                <CardText>
                                    <p><strong>By:</strong><Link to={`/users/${review.user_username}`}>{review.user_username}</Link></p>
                                    <p><strong>Rating:</strong> {review.rating}/5</p>
                                    <p>{review.body}</p>
                                </CardText>
                            </CardBody>
                            
                        </Card>
                    ))
                )}
            </CardBody>
        </Card>
        </Container>   
        </>
    )

}

export default MovieDetails;