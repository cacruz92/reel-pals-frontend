import React from "react";
import {Link} from "react-router-dom";
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    ListGroup,
    ListGroupItem
  } from "reactstrap";

const SearchResults = ({ results, error, category, hasSearched }) => {
    if(error){
        return (
            <div> <h1> {error} </h1></div>
        )
    }

    if (!hasSearched) {
        return (
          <div className="text-center mt-5">
            <h2>Search for your favorite movies or users</h2>
            <p>Enter a search term above to get started!</p>
          </div>
        );
      }

    if(!results || results.length === 0){
        return(
            <div>
                <h1> No results found.</h1>
                <p>Try adjusting your search terms or category.</p>
            </div>
        )
    }
    
    return (
        <div>
            <section className="col-md-4">
                {                
                results.map(item => (
                    <Card key={item.imdbID || item.username || item.id} className="mb-3">
                        <CardBody>
                            <CardTitle>
                               
                                    <ListGroupItem className="list-group-item">
                                        {category === "movies" && `${item.Title} (${item.Year})`}
                                        {category === "users" && `${item.username}`}
                                    </ListGroupItem>
                                
                            </CardTitle> 
                            <CardText>
                            {category === "movies" && (<Link 
                                to={`/movie/${item.imdbID}`}>
                                    <img src={item.Poster} alt={`${item.Title}'s poster`}></img> </Link>)}
                            {category === "users" && (<Link to={`/users/${item.username}`}> View Profile </Link>)}
                            
                            </CardText>   
                        </CardBody>
                    </Card>
                    ))}
            </section>
        </div>    
    )
    
}

export default SearchResults;