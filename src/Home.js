import React from "react";
import Feed from "./Feed";
import UserContext from "./UserContext";

const Home = ({getElapsedTime}) => {
    return <Feed getElapsedTime={getElapsedTime}  />
}

export default Home;