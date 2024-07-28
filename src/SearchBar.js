import React, {useState} from "react";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [year, setYear] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`Searching for ${searchTerm}`);
        onSearch(searchTerm, year);
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="searchTerm" placeholder={`Search...`} value={searchTerm} onChange={handleChange} />
                <button type="submit">Search</button>
            </form>
        </div>
    )
}

export default SearchBar;