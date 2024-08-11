import React, {useState} from "react";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [year, setYear] = useState("");
    const [category, setCategory] = useState("movies");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        onSearch(searchTerm, year, category);
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleCategoryChange = (e) =>{
        setCategory(e.target.value);
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>

                <input type="text" name="searchTerm" placeholder={`Search...`} value={searchTerm} onChange={handleChange} />
                <select value={category} onChange={handleCategoryChange}>
                    <option value="movies">Movies</option>
                    <option value="users">Users</option>
                    <option value="tags">Tags</option>
                </select>
                <button type="submit">Search</button>
            </form>
        </div>
    )
}

export default SearchBar;