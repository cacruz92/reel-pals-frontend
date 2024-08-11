import React, {useState} from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import OmdbApi from "./api";

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [searchCategory, setSearchCategory] = useState("");
  
    const handleSearch  = async (searchTerm, year = "", category) => {
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
    <>
    <div>
        <SearchBar 
        onSearch={handleSearch}
        />
    </div>
    <div>
        <SearchResults results={searchResults} error={searchError} category={searchCategory} />
    </div>
    </>
)
}

export default Search;