import React, {useContext, useEffect, useState} from "react";
import { useParams, NavLink } from "react-router-dom";
import OmdbApi from "./api";
import {UserContext} from "./UserContext";
import "./Profile.css"
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    ListGroup,
    ListGroupItem,
    Col,
    Row
  } from "reactstrap";

const Profile = () => {
    const {currentUser} = useContext(UserContext);
    const {username} = useParams()
    const [reviews, setReviews] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const fetchReviews = await OmdbApi.findUserReviews(username);
                setReviews(fetchReviews.reviews || []);

                const fetchProfileInfo = await OmdbApi.getUserProfile(username);
                setUserInfo(fetchProfileInfo.user);
                
                if(currentUser){
                    const userFollowing = await OmdbApi.getUserFollowing(currentUser.username);
                    setIsFollowing(userFollowing.following.some(user => user.username === username));
                }

                setIsLoading(false);
            } catch (e) {
                console.error("Error fetching user info:", e);
                setIsLoading(false);
            }
        };
        fetchUserInfo();
    }, [username, currentUser]);

    const handleFollow = async () => {
        try{
            if(currentUser){
                if(isFollowing){
                    await OmdbApi.unfollowUser(currentUser.username, username);
                } else {
                    await OmdbApi.followUser(currentUser.username, username);
                }   
            }
            setIsFollowing(!isFollowing);
        } catch (err){
          console.error("Application error:", err)
        }
      };
    

    console.log(userInfo)

    const capitalizeWords = (str) => {
        return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    }

    if(isLoading){
        return <div>Loading...</div>
    }

    if(!userInfo){
        return <div>Couldn't find information related to {username}</div>
    }
    return (
        <div className="Profile">
            <Card className="Profile-card">
                <CardBody>
                    <Row>
                        <Col xs="3">
                            <img
                                src={userInfo.picture}
                                alt="Profile Picture"
                                className="Profile-picture"
                            />
                        </Col>
                        <Col xs="9">
                            <CardTitle tag="h2">
                                {capitalizeWords(`${userInfo.firstName} ${userInfo.lastName}`)}
                            </CardTitle>
                            <CardText>
                                {capitalizeWords(`${username}`)}
                            </CardText>
                            <CardText>
                                {`Birthday: ${userInfo.birthday}`}
                            </CardText>
                            {currentUser && currentUser.username !== username && (
                                <button 
                                className="button-follow"
                                onClick={handleFollow}
                                color={isFollowing ? "green" : "lightGreen"}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )}
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <div className="Profile-reviews">
                <section>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
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
                        ))) : ( <p> No reviews Yet</p> )}
                </section>
            </div>
        </div>
    )

}

export default Profile;