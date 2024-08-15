import React, {useState, useContext} from "react";
import OmdbApi from "./api";
import {UserContext} from "./UserContext";
import {useNavigate} from "react-router-dom";
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    ListGroup,
    ListGroupItem,
    Button,
    Form, 
    FormGroup, 
    Input
  } from "reactstrap";

const CommentForm = ({reviewId, onCommentAdded}) => {
    const {currentUser} = useContext(UserContext);
    const navigate = useNavigate();

    // use state to control the form
    const [comment, setComment] = useState('');
    const [formErrors, setFormErrors] = useState([]);


    // allow the changes to the form to be entered into state 
    const handleChange = (e) => {
        const {value} = e.target;
        setComment(value);
    }

    // submit the comment
    async function handleSubmit(e) {
        e.preventDefault();
        if(!comment.trim()) return;

        try {
            const newComment = await OmdbApi.addComment(reviewId, comment);
            onCommentAdded(newComment);
            setComment("")
        } catch(e){
            console.error("Error adding comment:", e);
            setFormErrors([e.message || "An error occurred while submitting the comment"]);
        }
      };

      if(!currentUser) return null;

    return(
        <div className="formContainer">
            <Card>
                <CardBody>
                    {formErrors.length > 0 && (
                        <div className="alert alert-danger">
                            {formErrors.map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}
                    <Form 
                    className="commentForm" 
                    onSubmit={handleSubmit}
                    >
                        <FormGroup>
                        <label htmlFor="comment"><b>Leave a comment:</b></label>
                        <Input 
                        type="textarea"
                        name="comment"
                        id="comment"
                        value={comment}
                        onChange={handleChange}
                        />                      
                        <Button color="primary" type="submit">Submit</Button>

                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}

export default CommentForm;