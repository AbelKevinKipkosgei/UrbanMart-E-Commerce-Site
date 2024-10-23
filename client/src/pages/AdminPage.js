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
  const handleViewAllUsers = () => navigate("/admin/allusers");
  const handlePromoteUser = () => navigate("/admin/promoteuser");
  const handleDemoteUser = () => navigate("/admin/demoteuser");
  const handleViewUserOrders = () => navigate("/admin/userorders");
  const handleViewUserProducts = () => navigate("/admin/userproducts");
  const handleCreateProduct = () => navigate("/admin/createproduct");
  const handleEditProduct = () => navigate("/admin/editproduct");

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="sidebar-heading">Admin Dashboard</h2>
        <ul className="sidebar-nav">
          <li
            className={isActive("/admin/allusers") ? "active" : ""}
            onClick={handleViewAllUsers}
          >
            All Users
          </li>
          <li
            className={isActive("/admin/promoteuser") ? "active" : ""}
            onClick={handlePromoteUser}
          >
            Promote User
          </li>
          <li
            className={isActive("/admin/demoteuser") ? "active" : ""}
            onClick={handleDemoteUser}
          >
            Demote User
          </li>
          <li
            className={isActive("/admin/userorders") ? "active" : ""}
            onClick={handleViewUserOrders}
          >
            User Orders
          </li>
          <li
            className={isActive("/admin/userproducts") ? "active" : ""}
            onClick={handleViewUserProducts}
          >
            User Products
          </li>
          <li
            className={isActive("/admin/createproduct") ? "active" : ""}
            onClick={handleCreateProduct}
          >
            Create Product
          </li>
          <li
            className={isActive("/admin/editproduct") ? "active" : ""}
            onClick={handleEditProduct}
          >
            Edit Product
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <Outlet /> {/* This will render the nested admin routes */}
      </div>
    </div>
  );
};

export default AdminPage;
