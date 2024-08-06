import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Home from "./Home";
import NavBar from "./NavBar";
import ExplorePage from "./ExplorePage";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm"
import MovieDetails from "./MovieDetails";
import Profile from "./Profile";
import ReviewForm from "./ReviewForm";
import Search from "./Search.js";
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
        return result;
      }
      return { success: false, errors: ["Authentication failed"] };
  } catch(errors) {
    console.error("Authentication error:", errors)
    return { success: false, errors };
  }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <NavBar />
      
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/users/:username" element={ <Profile />} />
            <Route path="/login" element={<LoginForm handleUserAuth={handleUserAuth} />} />
            <Route path="/signup" element={<SignUpForm handleUserAuth={handleUserAuth} />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/movie/:id/review" element={<ReviewForm />} />
            <Route path="/search" element={<Search />} />

        </Routes>
    </div>
  );
}

export default App;