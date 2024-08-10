import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import OmdbApi from "./api";
import {UserContext} from "./UserContext";
import "./Feed.css";
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    ListGroup,
    ListGroupItem
  } from "reactstrap";

const Feed = () => {
    const {currentUser} = useContext(UserContext);
    const [feed, setFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getFeed(){
            if(currentUser){
                try{
                    const feedData = await OmdbApi.getUserFeed(currentUser.username);
                    setFeed(feedData);
                }catch(e){
                    console.error("Error fetching feed:", e);
                }
                setIsLoading(false);
            }
        }
        getFeed();
    }, [currentUser]);

    if(isLoading){
        return <div>Loading...</div>
    }

    return (
        <div className="Feed">
            <div className="Feed-content">
                {                
                feed.map(review => (
                    <Card key={review.id} className="mb-3">
                        <CardBody>
                            <CardTitle>
                                <ListGroupItem className="list-group-item">
                                    {review.poster && <img src={review.poster} alt={`${review.movie_title} poster`} className="Review-poster" />}
                                    <br></br>
                                    {`${review.title} - ${review.movie_title}`}
                                </ListGroupItem>
                            </CardTitle> 
                            <CardText>
                                <Link to={`/users/${review.user_username}`}>
                                    {review.user_username}
                                </Link>
                                <p>Rating: {review.rating}/5</p>
                                <p>{review.body.substring(0,250)}...</p>
                                <Link to={`/reviews/${review.id}`}>Read more</Link>
                            </CardText>   
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>    
    )
};

export default Feed;