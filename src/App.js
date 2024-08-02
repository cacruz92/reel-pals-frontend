import './App.css';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
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
import UserContext from './UserContext';
import OmdbApi from './api.js';
import useLocalStorageState from './hooks/useLocalStorageState.js';


function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorageState('token', null);

  useEffect(() => {
    async function getCurrentUser(){
      if(token){
        try{
          OmdbApi.token = token;
          let {username} = jwtDecode(token);
          let user = await OmdbApi.get(username);
          setCurrentUser(user)
        } catch (e) {
          console.error("Issue loading user information:", e);
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
      let user;
      if (authType === 'login') {
        user = await OmdbApi.login(formData);
      } else if (authType === 'register') {
        user = await OmdbApi.register(formData);
      } else {
        throw new Error('Invalid auth type');
      }

      setToken(OmdbApi.token);
      setCurrentUser(user);
      return {success: true};
  } catch(errors) {
    console.error("Authentication error:", errors)
    return { success: false, errors };
  }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
    <div className="App">
      <NavBar />
      <Router>
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
        </Router>
    </div>
    </UserContext.Provider>
  );
}

export default App;