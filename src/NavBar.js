import React from "react";
import UserContext from "./UserContext";
import {NavLink} from "react-router-dom";
import {Navbar, Nav, NavItem, Container} from "reactstrap";

const NavBar = () => {
return (
    <nav className="NavBar">
        <div className="nav-container">
            <NavLink exact to="/" className="navbar-brand">
              Reel Pals
            </NavLink>
              <div className="nav-links right-align">
              {/* {currentUser ? ( */}
                <>
                    <NavLink to="/" className="nav-link"> Explore </NavLink>
                    <NavLink to="/" className="nav-link"> Reviews </NavLink>
                    <NavLink to="/" className="nav-link"> Profile </NavLink>
                    <NavLink to="/" 
                    // onClick={logout} 
                    className="nav-link"> Logout </NavLink> 
                </>
              {/* ) : (
                <>
                    <NavLink to="/login" className="nav-link"> Login </NavLink>
                    <NavLink to="/signup" className="nav-link"> Signup </NavLink>
                </>
              )} */}
              </div>
            </div>
        </nav>
)
}

export default NavBar;