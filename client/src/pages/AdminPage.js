import React from "react";
import "./AdminPage.css";
import { useNavigate } from "react-router-dom";


const AdminPage = () => {
  const navigate = useNavigate();
  const handleViewAllUsers = ()  => {
    navigate("/admin/allusers");
  }
  const handleViewUserOrders = () => {
    navigate("/admin/userorders");
  }
  const handleViewUserProducts = () => {
    navigate("/admin/userproducts");
  }
  const handlePromoteUser = () => {
    navigate("/admin/promoteuser");
  }
  const handleDemoteUser = () => {
    navigate("/admin/demoteuser");
  }
  return (
    <div className="admin-page">
      <h2 className="admin-heading">Users</h2>
      <div className="button-grid">
        <div className="button-tile" onClick={handleViewAllUsers}>
          All Users
        </div>
        <div className="button-tile" onClick={handlePromoteUser}>
          Promote User
        </div>
        <div className="button-tile" onClick={handleDemoteUser}>
          Demote User
        </div>
        <div className="button-tile" onClick={handleViewUserOrders}>
          User Orders
        </div>
        <div className="button-tile" onClick={handleViewUserProducts}>
          User Products
        </div>
      </div>

      <h2 className="admin-heading">Products</h2>
      <div className="button-grid">
        <div className="button-tile">All Products</div>
        <div className="button-tile">Create Product</div>
        <div className="button-tile">Edit Product</div>
        <div className="button-tile">Delete Product</div>
      </div>
    </div>
  );
};

export default AdminPage;
