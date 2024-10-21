import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartItems, orders, isLoggedIn, onLogout, userRole }) {
  const navigate = useNavigate();

  // Handle logout and redirect
  const handleLogout = () => {
    onLogout(); // Call the logout handler
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>UrbanMart</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/admin">Admin</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/cart">Cart ({cartItems.length})</Link>
        </li>
        <li>
          <Link to="/orders">Orders ({orders.length})</Link>
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
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
            <Link to="/signup">
              <button className="signup-btn">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
