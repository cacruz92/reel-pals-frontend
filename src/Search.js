import React, {useState} from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import OmdbApi from "./api";

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);
  
    const handleSearch  = async (searchTerm, year = "") => {
      try{
        const results = await OmdbApi.searchMovies(searchTerm, year);
        if(results){
          setSearchResults(results.Search);
          setSearchError(null);
        } else {
          setSearchResults([]);
          setSearchError("No results found");
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
        <SearchResults results={searchResults} error={searchError} />
    </div>
    </>
)
}

export default Search;