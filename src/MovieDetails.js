import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import OmdbApi from "./api";
import ReviewForm from "./ReviewForm";
import {
    Card,
    CardBody,
    CardTitle,
    CardText
  } from "reactstrap";

const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try{
                const result = await OmdbApi.getMovieDetails(id);
                setMovie(result);
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
        <>
        <div>
            <section className="col-md-4">
                    <Card key={movie.imdbID} className="mb-3">
                        <CardBody>
                            <CardTitle><h1>{movie.Title}</h1></CardTitle> 
                            <CardText>
                                <img src={movie.Poster} alt={`${movie.Title}'s poster`}></img> 
                                <p><strong>Director:</strong> {movie.Director}</p>
                                <p><strong>Actors:</strong> {movie.Actors}</p>
                                <p><strong>Plot:</strong> {movie.Plot}</p>
                                <p><strong>Genre:</strong> {movie.Genre}</p>
                                <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
                                <p><strong>Runtime:</strong> {movie.Runtime}</p>
                                <p><strong>Released:</strong> {movie.Released}</p>
                                <p><strong>Awards:</strong> {movie.Awards}</p>
                                </CardText>   
                        </CardBody>
                    </Card>
                    
            </section>
        </div>
        <div>
            <ReviewForm movie_imdb_id={movie.imdbID} poster={movie.Poster}/>
        </div>
        </>    
    )

}

export default MovieDetails;