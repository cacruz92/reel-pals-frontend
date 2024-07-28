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
        if(results.Response === "True"){
            console.log(results.Search)
          setSearchResults(results.Search);
          setSearchError(null);
        } else {
          setSearchResults([]);
          setSearchError(results.Error);
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