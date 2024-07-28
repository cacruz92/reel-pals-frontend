import React, { useState } from "react";

const UserContext = React.createContext();

export function UserProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    return(
        <UserContext.Provider value={{ currentUser, setCurrentUser, token, setToken }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;