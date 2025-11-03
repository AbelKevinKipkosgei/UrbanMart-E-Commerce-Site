import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children, isLoggedIn, userRole }) => {
  if (!isLoggedIn || userRole !== "admin") {
    // Redirect to login if the user is not logged in or not an admin
    return <Navigate to="/login" />;
  }
  return children;
};

export default AdminProtectedRoute;
