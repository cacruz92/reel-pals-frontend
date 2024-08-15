import React, {useState} from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import OmdbApi from "./api";
import "./styles/Search.css"
import {
  Card,
  CardBody,
  Container,
  Row,
  Col
} from "reactstrap";

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [searchCategory, setSearchCategory] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
  
    const handleSearch  = async (searchTerm, year = "", category) => {
      setHasSearched(true);
      try{
        let results;
        if (category === "movies"){
          setSearchCategory("movies");
          const results = await OmdbApi.searchMovies(searchTerm, year);
          if(results){
            setSearchResults(results.Search);
            setSearchError(null);
          } else {
            setSearchResults([]);
            setSearchError("No results found");
          }  
        } else if(category === "users"){
          setSearchCategory("users");
          const results = await OmdbApi.searchByUser(searchTerm);
          if(results && results.users){
            setSearchResults(results.users);
            setSearchError(null);
          } else {
            setSearchResults([]);
            setSearchError("No results found");
          }  
        } else {
          setSearchCategory("tags");
          const results = await OmdbApi.searchByTag(searchTerm);
          if(results && results.reviews){
            setSearchResults(results.reviews);
            setSearchError(null);
          } else {
            setSearchResults([]);
            setSearchError("No results found");
          }  
        }
        
      } catch (e) {
        console.error("Error searching movies:", e);
        setSearchError("An error occurred while searching. Please try again.");
      }
    }
    
return(
  <Container className="Search">
  <Card className="Search-card">
      <CardBody>
          <SearchBar onSearch={handleSearch} />
      </CardBody>
  </Card>
    <Card className="Search-card">
        <SearchResults results={searchResults} error={searchError} category={searchCategory} hasSearched={hasSearched} />
    </Card>
    </Container>
)
}

export default Search;