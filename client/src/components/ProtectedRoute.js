import React from "react";
import { Navigate } from "react-router-dom";

// Functional ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
