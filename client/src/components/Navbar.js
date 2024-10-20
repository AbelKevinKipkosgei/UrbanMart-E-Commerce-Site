// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({cartItems, orders}) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>UrbanMart</h1>
      </div>
      <ul className="navbar-links">
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
          <Link to="/orders">Orders ({orders.length})</Link>{" "}
          {/* Add Orders link */}
        </li>
      </ul>
      <div className="navbar-buttons">
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
        <Link to="/signup">
          <button className="signup-btn">Sign Up</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
