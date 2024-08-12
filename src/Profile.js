import React, {useContext, useEffect, useState} from "react";
import { useParams, NavLink, Link, useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import OmdbApi from "./api";
import {UserContext} from "./UserContext";
import "./Profile.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Col,
    Row,
    Button
  } from "reactstrap";

const Profile = () => {
    const {currentUser} = useContext(UserContext);
    const {username} = useParams()
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followToggle, setFollowToggle] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const fetchReviews = await OmdbApi.findUserReviews(username);
                const reviewsWithlikes = await Promise.all(fetchReviews.reviews.map(async (review) => {
                    const likes_count = await OmdbApi.getLikeCount(review.id); 
                    return { ...review, likes_count }
                }))
                setReviews(reviewsWithlikes);

                const fetchProfileInfo = await OmdbApi.getUserProfile(username);
                setUserInfo(fetchProfileInfo.user);
                
                if(currentUser){
                    const userFollowing = await OmdbApi.getUserFollowing(currentUser.username);
                    const isFollowingUser = Array.isArray(userFollowing) && userFollowing.some(user => user.username === username);
                    setIsFollowing(isFollowingUser);
                }

                setIsLoading(false);
            } catch (e) {
                console.error("Error fetching user info:", e);
                setIsLoading(false);
            }
        };
        fetchUserInfo();
    }, [username, currentUser, followToggle]);

    const handleFollow = async () => {
        try{
            if(currentUser){
                let result;
                if(isFollowing){
                    result = await OmdbApi.unfollowUser(currentUser.username, username);
                } else {
                    result = await OmdbApi.followUser(currentUser.username, username);
                }   
                if (result && !result.error) {
                    setFollowToggle(prev => !prev);
                    setIsFollowing(!isFollowing);
                } else {
                    console.error("Follow/Unfollow operation failed:", result.error);
                }
            }
            
        } catch (e){
          console.error("Application error:", e)
        }
      };

      const formatBirthday = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

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
                {currentUser && currentUser.username === username && (
                        <Button 
                            color="primary" 
                            size="sm" 
                            className="edit-profile-btn"
                            onClick={() => navigate(`/users/${username}/edit`)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    )}
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
                                {`Birthday: ${formatBirthday(userInfo.birthday)}`}
                            </CardText>
                            {currentUser && currentUser.username !== username && (
                                <button 
                                className="button-follow"
                                onClick={handleFollow}
                                
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
                                            <p>Rating: {review.rating}/5</p>
                                            <p>Review body: {review.body}</p>
                                            <Link to={`/reviews/${review.id}`}>Read more</Link>
                                        </CardText>
                                    </Col>
                                </Row>
                                <LikeButton 
                                    reviewId={review.id} 
                                    initialLikeCount={review.likes_count} 
                                    initialIsLiked={review.is_liked_by_current_user}
                                />
                                    
                            </Card>
                        ))) : ( <p> No reviews Yet</p> )}
                </section>
            </div>
        </div>
    )

}

export default Profile;