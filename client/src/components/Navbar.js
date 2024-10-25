import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartItems, orders, isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  // Handle logout and redirect
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h2>UrbanMart</h2>
        </div>
        <ul className="navbar-links">
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Cart ({cartItems.length})
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Orders
            </NavLink>
          </li>
        </ul>
        <div className="navbar-buttons">
          {isLoggedIn ? (
            <>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <button className="login-btn">Login</button>
              </NavLink>
              <NavLink to="/signup">
                <button className="signup-btn">Sign Up</button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
