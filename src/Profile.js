import React, {useContext, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
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

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const fetchReviews = await OmdbApi.findUserReviews(username);
                setReviews(fetchReviews.reviews || []);

                const fetchProfileInfo = await OmdbApi.getUserProfile(username);
                setUserInfo(fetchProfileInfo.user);
                console.log("User INFO:", fetchProfileInfo)
                setIsLoading(false);
            } catch (e) {
                console.error("Error fetching user info:", e);
                setIsLoading(false);
            }
        };
        fetchUserInfo();
    }, [username]);

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
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <div className="Profile-reviews">
                <section>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <Card key={review.id} className="Profile-card">
                                <Col xs="12">
                                    <CardTitle>{review.title}</CardTitle>
                                    </Col>
                                    <Col xs="12">
                                    <CardText>
                                        <p>{review.rating}/5</p>
                                        <p>{review.body}</p>
                                    </CardText>
                                    </Col>
                            </Card>
                        ))) : ( <p> No reviews Yet</p> )}
                </section>
            </div>
        </div>
    )

}

export default Profile;