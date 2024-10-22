import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import "./CreateProduct.css";

const CreateProduct = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      image_url: "",
      description: "",
    },
    onSubmit: async (values) => {
      try {
        const productData = {
          ...values,
          price: parseFloat(values.price),
        };

        const response = await fetch("/admin/products", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error creating product");
        }

        const data = await response.json();
        setMessage(`Product "${data.name}" created successfully.`);
        setError("");
        formik.resetForm();
      } catch (err) {
        console.error("Error:", err);
        setError("Error creating product");
        setMessage("");
      }
    },
  });

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000); // 5000 ms = 5 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [error]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000); // 5000 ms = 5 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [message]);

  return (
    <div className="create-product-card">
      <h2 className="create-product-title">Create Product</h2>
      {error && <div className="create-product-message error">{error}</div>}
      {message && (
        <div className="create-product-message success">{message}</div>
      )}
      <form className="create-product-form" onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            name="price"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.price}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image_url">Image URL:</label>
          <input
            id="image_url"
            name="image_url"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.image_url}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            required
          />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
