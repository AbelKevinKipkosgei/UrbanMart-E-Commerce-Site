// AdminPage.js
import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./AdminPage.css"; // Assuming you have CSS for styling

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  // Handlers for navigation
  const handleViewAllUsers = () => navigate("/admin/manageusers");
  const handleViewOrders = () => navigate("/admin/manageorders");
  const handleViewAllProducts = () => navigate("/admin/manageproducts");

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="sidebar-heading">Admin Dashboard</h2>
        <ul className="sidebar-nav">
          <li
            className={isActive("/admin/manageusers") ? "active" : ""}
            onClick={handleViewAllUsers}
          >
            Manage Users
          </li>
          <li
            className={isActive("/admin/manageorders") ? "active" : ""}
            onClick={handleViewOrders}
          >
            Manage Orders
          </li>
          <li
            className={isActive("/admin/manageproducts") ? "active" : ""}
            onClick={handleViewAllProducts}
            >
              Manage Products
            </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
