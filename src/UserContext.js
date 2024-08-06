import React, { useState } from "react";
import useLocalStorageState from "./hooks/useLocalStorageState";

export const UserContext = React.createContext();

export function UserProvider({children}) {
    const [currentUser, setCurrentUser] = useLocalStorageState('currentUser', null);
    const [token, setToken] = useLocalStorageState('token', null);

    const login = (user, userToken) => {
        setCurrentUser(user);
        setToken(userToken)
    };

    const logout = () => {
        setCurrentUser(null);
        setToken(null);
    }

    return(
        <UserContext.Provider value={{ currentUser, setCurrentUser, token, setToken, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;