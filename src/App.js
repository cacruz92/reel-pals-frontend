import './App.css';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Home from "./Home";
import NavBar from "./NavBar";
import ExplorePage from "./ExplorePage";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm"
import MovieDetails from "./MovieDetails";
import Profile from "./Profile";
import ReviewForm from "./ReviewForm";
import Search from "./Search.js";
import OmdbApi from './api.js';


function App() {


  return (
    
    <div className="App">
      <NavBar />
      <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/users/:username" element={ <Profile />} />
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/movie/:id/review" element={<ReviewForm />} />
            <Route path="/search" element={<Search />} />

        </Routes>
        </Router>
    </div>
  );
}

export default App;
