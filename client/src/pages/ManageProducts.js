import React, { useEffect, useState } from "react";
import EditProductModal from "../components/EditProductModal";
import CreateProduct from "../components/CreateProductModal";
import "./ManageProducts.css";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/admin/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/admin/products/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error || "Failed to delete product");
        }

        setProducts(products.filter((product) => product.id !== productId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  const handleSubmitEdit = async (updatedProduct) => {
    try {
      const response = await fetch(`/admin/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedData = await response.json();
      setProducts(
        products.map((product) =>
          product.id === updatedProduct.id ? updatedData : product
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateProduct = (newProduct) => {
    setProducts([...products, newProduct]);
    closeCreateModal();
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-all-products">
      <h2>All Products</h2>
      <button
        className="admin-create-product-button"
        onClick={() => setIsCreateModalOpen(true)}
      >
        Create Product
      </button>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="admin-product-list">
          {products.map((product) => (
            <li key={product.id} className="admin-product-card">
              <img
                src={product.image_url}
                alt={product.name}
                className="admin-product-image"
              />
              <div className="admin-product-details">
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <p>{product.description}</p>
              </div>
              <div className="admin-product-actions">
                <button
                  onClick={() => handleEdit(product)}
                  className="admin-edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="admin-delete-button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={closeModal}
          onSubmit={handleSubmitEdit}
        />
      )}
      {isCreateModalOpen && (
        <CreateProduct
          onClose={closeCreateModal}
          onCreate={handleCreateProduct}
        />
      )}
    </div>
  );
}

export default AllProducts;

