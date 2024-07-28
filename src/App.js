import './App.css';
import { Route, Routes} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Home from "./Home";
import NavBar from "./NavBar";
import ExplorePage from "./ExplorePage";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm"
import MovieDetails from "./MovieDetails";
import Profile from "./Profile";
import ReviewForm from "./ReviewForm";
import Search from "./Search";


function App() {
  return (
    
    <div className="App">
      <NavBar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/users/:username" element={ <Profile />} />
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/movie/:movieId" element={<MovieDetails />} />
            <Route path="/movie/:movieId/review" element={<ReviewForm />} />
            <Route path="/search" element={<Search />} />

        </Routes>
    </div>
  );
}

export default App;
