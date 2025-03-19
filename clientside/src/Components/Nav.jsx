import React from "react";
import "./scss/Nav.scss";
import { Link, useNavigate } from "react-router-dom";

function Nav({ setName }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handlelogout = () =>{
    localStorage.removeItem("token");
    alert("Successfully logged out")
    navigate('/')
  };
  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <span className="logo">LIBRARY </span>
        </div>
        <div className="navbar-center">
          <input
            type="text"
            className="serch-input"
            placeholder="search for books, author, category..... "
            onChange={(e) => setName(e.target.value)}
          />
          {/* <button className="serch-btn">
            <img src="mm" alt="#search" />
          </button> */}
        </div>
        <div className="navbar-right">
          <Link to='/' className='menu-item'>Home</Link>
          {token ? (
            <div className="drop-down">
              <button className="dropdown-btn">Account</button>
              <div className="dropdown-content">
                <Link to='/profile'>Profile</Link>
                <button onClick={handlelogout}>Logout</button>
              </div>
            </div>
          ):(
            <Link to='/login' className="menu-item">Login</Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Nav;
