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

const SearchResults = ({ results, error, category }) => {
    if(error){
        return (
            <div> <h1> {error} </h1></div>
        )
    }
    if(!results || results.length === 0){
        return(
            <div><h1> No results found.</h1></div>
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
                                        {category === "tags" && `${item.title} - ${item.movie_title})`}
                                    </ListGroupItem>
                                
                            </CardTitle> 
                            <CardText>
                            {category === "movies" && (<Link 
                                to={`/movie/${item.imdbID}`}>
                                    <img src={item.Poster} alt={`${item.Title}'s poster`}></img> </Link>)}
                            {category === "users" && (<Link to={`/users/${item.username}`}> View Profile </Link>)}
                            {category === "tags" && (
                                <>
                                <p> Rating: {item.rating}/5 </p>
                                <p>{item.body.substring(0,75)}...</p>
                                <Link 
                                to={`/reviews/${item.id}`}> </Link>
                                </>
                            )}
                            </CardText>   
                        </CardBody>
                    </Card>
                    ))}
            </section>
        </div>    
    )
    
}

export default SearchResults;