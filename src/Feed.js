import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import LikeButton from "./LikeButton";
import OmdbApi from "./api";
import {UserContext} from "./UserContext";
import "./styles/Feed.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    ListGroup,
    ListGroupItem,
    Container,
    Button
  } from "reactstrap";

const Feed = ({getElapsedTime}) => {
    const {currentUser} = useContext(UserContext);
    const [feed, setFeed] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getFeed(){
            if(currentUser){
                try{
                    const feedData = await OmdbApi.getUserFeed(currentUser.username);
                    const feedWithlikes = await Promise.all(feedData.map(async (review) => {
                        const likes_count = await OmdbApi.getLikeCount(review.id); 
                        return { ...review, likes_count }
                    }))
                
                    setFeed(feedWithlikes);
                }catch(e){
                    console.error("Error fetching feed:", e);
                }
                setIsLoading(false);
            }
        }
        getFeed();
    }, [currentUser]);



    if (!currentUser) {
        return (
            <div className="Feed ">
                <div className="Feed-content">
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h2>Welcome to Reel Pals <FontAwesomeIcon icon={faFilm} /> </h2>
                            </CardTitle>
                        </CardBody>
                        <CardText>
                            <Link to="/login" className="me-2">
                                <Button color="primary">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button color="primary">Signup</Button>
                            </Link>
                        </CardText>
                    </Card>
                </div>
            </div>
        );
    }

    if(isLoading){
        return <div>Loading...</div>
    }
    
    if (feed.length === 0) {
        return (
            <div className="Feed">
                <div className="Feed-content">
                    <Card className="mb-3">
                        <CardBody>
                            <CardTitle>
                                <h2>Welcome to Reel Pals <FontAwesomeIcon icon={faFilm} /></h2>
                            </CardTitle>
                            <CardText>
                                <p>Your feed is currently empty. Visit the explore page to find movies to view and rate or users to follow!</p>
                                <Link to="/search">
                                    <Button color="primary">Explore</Button>
                                </Link>
                            </CardText>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="Feed">
            <div className="Feed-content">
                {                
                feed.map(review => (
                    <Card key={review.id} className="mb-3">
                        <CardBody>
                            <CardTitle>
                                    {review.poster && <img src={review.poster} alt={`${review.movie_title} poster`} className="Review-poster" />}
                                    <br></br>
                                    "{`${review.title}`}"
                            </CardTitle> 
                            <CardText>
                                <Link to={`/users/${review.user_username}`}>
                                    {review.user_username}
                                </Link>
                                <p>Rating: {review.rating}/5</p>
                                <p>{review.body.substring(0,250)}...</p>
                                <p>Posted: {getElapsedTime(review.created_at)}</p>
                                <Link to={`/reviews/${review.id}`}>Read more</Link>
                            </CardText> 
                             
                        </CardBody>
                        <LikeButton 
                                    reviewId={review.id} 
                                    initialLikeCount={review.likes_count} 
                                    initialIsLiked={review.is_liked_by_current_user}
                                />
                    </Card>
                ))}
            </div>
        </div>    
    )
};

export default Feed;