import React from "react";
import { Formik, Form, Field } from "formik";
import "./CreateProductModal.css";

const CreateProductModal = ({ onClose, onCreate }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Product</h2>
        <Formik
          initialValues={{
            name: "",
            price: "",
            image_url: "",
            description: "",
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const productData = {
                ...values,
                price: parseFloat(values.price),
              };

              const response = await fetch("api/admin/products", {
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
              onCreate(data); // Pass the new product to the parent component
              onClose(); // Close the modal after creation
            } catch (error) {
              setErrors({ submit: "Failed to create product." });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <Field type="text" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field type="text" name="description" required />
              </div>
              <div className="form-group">
                <label htmlFor="image_url">Image URL</label>
                <Field type="text" name="image_url" required />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <Field
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.submit && <div className="error">{errors.submit}</div>}
              <div className="modal-actions">
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Product"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateProductModal;
