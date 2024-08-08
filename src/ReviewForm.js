import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import OmdbApi from "./api";
import { FaStar } from "react-icons/fa";
import "./ReviewForm.css";
import {UserContext} from "./UserContext"
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    ListGroup,
    ListGroupItem
  } from "reactstrap";

const ReviewForm = ({movie_imdb_id}) => {
    const navigate = useNavigate();
    const {currentUser} = useContext(UserContext);
    const INITIAL_STATE = {
        rating: "",
        title: "",
        body: ""
    };

    // use state to control the form
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [formErrors, setFormErrors] = useState([]);
    const [hover, setHover] = useState(null);


    // allow the changes to the form to be entered into state 
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
    }

    const handleRatingChange = (ratingValue) => {
        setFormData(formData => ({
            ...formData,
            rating: ratingValue
        }))
    }

    // submit the form if the form is correct, otherwise alert them it's not
    async function handleSubmit(e) {
        e.preventDefault();
        if(!currentUser){
            setFormErrors(["You must be logged in to submit a review"]);
            return;
        }

        console.log(movie_imdb_id);
        console.log(currentUser.username);
        console.log(formData);
        try {
            await OmdbApi.addReview({
            ...formData,
            movie_imdb_id,
            username: currentUser.username 
            });
            navigate('/');
        } catch(e){
            setFormErrors([e.message || "An error occurred while submitting the review"]);
        }
      }

    return(
        <div className="formContainer">
            <Card>
                <CardBody>
                    <h1>Write a review for this movie!</h1>
                    {formErrors.length > 0 && (
                        <div className="alert alert-danger">
                            {formErrors.map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}
                    <form 
                    className="signUpForm" 
                    onSubmit={handleSubmit}
                    >
                        <div>
                        <label htmlFor="rating">Rating:</label>

                        {[...Array(5)].map((star, i) => {
                            const ratingValue = i + 1;

                            return (
                                <label key={i}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => handleRatingChange(ratingValue)}
                                        style={{display: 'none'}}
                                    />

                                    <FaStar
                                        color={ratingValue <= (hover || formData.rating) ? "#ffc107" : "#e4e5e9"}
                                        size={25}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(null)}
                                    />
                                    </label>
                            )
                        })}
                        </div>

                        <br></br>                
                        <label htmlFor="title">Title:</label>
                        <input 
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        />
                        <br></br>
                        
                        <label htmlFor="body">Body:</label>
                        <input 
                        id="body"
                        type="text"
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                        />
                        <br></br>
                        
                        <button>Submit</button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default ReviewForm;