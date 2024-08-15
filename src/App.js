import './styles/App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Home from "./Home";
import NavBar from "./NavBar";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm"
import MovieDetails from "./MovieDetails";
import Profile from "./Profile";
import Review from './Review.js';
import EditProfileForm from './EditProfileForm.js';
import ReviewForm from "./ReviewForm";
import Search from "./Search.js";
import EditReviewForm from "./EditReviewForm.js"
import {useContext, useEffect, useState } from 'react';
import {UserContext, UserProvider} from './UserContext';
import OmdbApi from './api.js';
// import useLocalStorageState from './hooks/useLocalStorageState.js';


function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, setCurrentUser, token, setToken } = useContext(UserContext);

  useEffect(() => {    

      async function getCurrentUser(){
        if(token && !currentUser){
          try{
            const user = await OmdbApi.getCurrentUser(token);
            setCurrentUser(user);
          } catch (e) {
            console.error("Issue loading user information:", e);
            localStorage.removeItem('token')
            setCurrentUser(null);
            setToken(null);
          }
        }
        setIsLoading(false)
    }
    getCurrentUser();
  }, [token, setCurrentUser, setToken])

  async function handleUserAuth(formData, authType) {
    try {
      let result;
      if (authType === 'login') {
        result = await OmdbApi.login(formData);
      } else if (authType === 'register') {
        result = await OmdbApi.register(formData);
      }

      if(result && result.token){
        setCurrentUser(result.user);
        setToken(result.token);
        navigate('/')
        return { success: true, ...result };
      }
      return { success: false, errors: ["Authentication failed"] };
  } catch(errors) {
    console.error("Authentication error:", errors)
    return { success: false, errors };
  }
  }

  const getElapsedTime = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const elapsed = now - posted;

    // Ensure both dates are valid
    if (isNaN(now.getTime()) || isNaN(posted.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Unknown';
    }

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days/7);
    const months = Math.floor(days/30);
    const years = Math.floor(days/365);

        // For debugging
        console.log('Now:', now);
        console.log('Posted:', posted);
        console.log('Elapsed milliseconds:', elapsed);
        console.log('Seconds:', seconds);
        console.log('Minutes:', minutes);
        console.log('Hours:', hours);
        console.log('Days:', days);
        console.log('Months:', months);
        console.log('Years:', years);
        

    if(years >0){
        return `${years} year${years > 1 ? 's' : ''} ago`
    }else if (months > 0){
        return `${months} month${months > 1 ? 's' : ''} ago`
    } else if (weeks > 0) {
        return `${weeks} day${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds > 30) {
        return `${seconds} seconds ago`;
    } else {
        return 'Just now';
    }
};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <NavBar />
      
        <Routes>
            <Route path="/" element={<Home getElapsedTime={getElapsedTime} />} />
            <Route path="/search" element={<Search />} />
            <Route path="/users/:username" element={ <Profile getElapsedTime={getElapsedTime}  />} />
            <Route path="/login" element={<LoginForm handleUserAuth={handleUserAuth} />} />
            <Route path="/signup" element={<SignUpForm handleUserAuth={handleUserAuth} />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/movie/:id/review" element={<ReviewForm />} />
            <Route path="/reviews/:reviewId" element={<Review getElapsedTime={getElapsedTime} />} />
            <Route path="/reviews/:reviewId/edit" element={<EditReviewForm />} />
            <Route path="/users/:username/edit" element={<EditProfileForm />} />
        </Routes>
    </div>
  );
}

export default App;