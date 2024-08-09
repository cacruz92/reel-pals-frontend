import React, { useContext } from "react";
import {UserContext} from "./UserContext";
import { NavLink} from 'react-router-dom';
import {Navbar, Nav, NavItem, Container} from "reactstrap";
import "./NavBar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const { currentUser, logout } = useContext(UserContext);
  return (

      <nav className="NavBar">
          <div className="nav-container">
              <NavLink to="/" className="navbar-brand">
              Reel Pals <FontAwesomeIcon icon={faFilm} /> 
              </NavLink>
                <div className="nav-links right-align">
                {currentUser ? (
                  <>
                      <NavLink to="/search" className="nav-link"> Explore </NavLink>
                      <NavLink to="/" className="nav-link"> Reviews </NavLink>
                      <NavLink to={`users/${currentUser.username}`} className="nav-link"> Profile </NavLink>
                      <NavLink to="/" 
                      onClick={logout} 
                      className="nav-link"> Logout </NavLink> 
                  </>
                ) : (
                  <>
                      <NavLink to="/login" className="nav-link"> Login </NavLink>
                      <NavLink to="/signup" className="nav-link"> Signup </NavLink>
                  </>
                )}
                </div>
              </div>
          </nav>

  )
}

export default NavBar;