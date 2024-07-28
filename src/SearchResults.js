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

const SearchResults = ({ results, error }) => {
    console.log(results)
    if(error){
        return (
            <div> <h1> {error} </h1></div>
        )
    }
    if(!results){
        return(<div><h1>  </h1></div>)
    }
    if(results.length === 0){
        return(
            <div><h1> No results found.</h1></div>
        )
    }
    
    return (
        <div>
            <section className="col-md-4">
                {                
                results.map(movie => (
                    <Card key={movie.imdbID} className="mb-3">
                        <CardBody>
                            <CardTitle>
                               
                                    <ListGroupItem className="list-group-item">
                                        {movie.Title}
                                        ({movie.Year})
                                    </ListGroupItem>
                                
                            </CardTitle> 
                            <CardText>
                            <Link 
                                to={`/movie/${movie.imdbID}`}>
                                    <img src={movie.Poster} alt={`${movie.Title}'s poster`}></img> </Link>
                                </CardText>   
                        </CardBody>
                    </Card>
                    ))}
            </section>
        </div>    
    )
    
}

export default SearchResults;