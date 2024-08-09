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
        console.log(category);
        if (category === "movies"){
          console.log("Searching movies...");
          setSearchCategory("movies");
          const results = await OmdbApi.searchMovies(searchTerm, year);
          console.log("Movie search results:", results);
          if(results){
            setSearchResults(results.Search);
            setSearchError(null);
          } else {
            setSearchResults([]);
            setSearchError("No results found");
          }  
        } else if(category === "users"){
          console.log("Searching users...");
          setSearchCategory("users");
          const results = await OmdbApi.searchByUser(searchTerm);
          console.log("User search results:", results);
          if(results && results.users){
            setSearchResults(results.users);
            setSearchError(null);
          } else {
            setSearchResults([]);
            setSearchError("No results found");
          }  
        } else {
          console.log("Searching by tag...");
          setSearchCategory("tags");
          const results = await OmdbApi.searchByTag(searchTerm);
          console.log("Search by tag results:", results);
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