import React, {useState} from "react";
import useLocalStorageState from './hooks/useLocalStorageState';
import {useNavigate} from "react-router-dom";
import OmdbApi from "./api";
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    ListGroup,
    ListGroupItem
  } from "reactstrap";

const SignupForm = ({handleUserAuth}) => {
    const navigate = useNavigate();
    const INITIAL_STATE = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        birthday: ""
    };

    // use state to control the form
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [formErrors, setFormErrors] = useState([])

    const[token, setToken] = useLocalStorageState('token', '')

    // allow the changes to the form to be entered into state 
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
    }

    // submit the form if the form is correct, otherwise alert them it's not
    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const user = await OmdbApi.register(formData);
            console.log("Registration successful", user);
            if (user.token) {
                setToken(user.token);
            }
            navigate("/");
        }catch(e){
            console.error("Registration failed:", e);
            setFormErrors([e.message])
        }
      }

    return(
        <div className="formContainer">
            <Card>
                <CardBody>
                    <h1>Sign Up</h1>

                    <form 
                    className="signUpForm" 
                    onSubmit={handleSubmit}
                    >
                        
                        <label htmlFor="username">Username</label>
                        <input 
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        />
                        <br></br>                
                        <label htmlFor="password">Password</label>
                        <input 
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        />
                        <br></br>
                        
                        <label htmlFor="firstName">First name</label>
                        <input 
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        />
                        <br></br>
                        <label htmlFor="lastName">Last name</label>
                        <input 
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        />
                        <br></br>
                        <label htmlFor="email">Email</label>
                        <input 
                        id="email"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        />
                        <br></br>
                        <label htmlFor="birthday">Birthday</label>
                        <input 
                        id="birthday"
                        type="date"
                        name="birthday"
                        value={formData.birthday}
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

export default SignupForm;