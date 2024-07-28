import React, {useContext} from "react";
import {Navigate} from 'react-router-dom';
import UserContext from "./UserContext";
import Unauthorized from "./Unauthorized";

const ProtectedRoute = ({children}) => {
    const {currentUser} = useContext(UserContext);

    if(!currentUser) {
        return <Unauthorized />;
    }

    return children
};

export default ProtectedRoute;