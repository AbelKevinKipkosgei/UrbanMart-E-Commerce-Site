import React from "react";
import { Formik, Form, Field } from "formik";
import "./EditProductModal.css";

const EditProductModal = ({ product, onClose, onSubmit }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Product</h2>
        <Formik
          initialValues={{
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            price: product.price,
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await onSubmit(values);
              onClose();
            } catch (error) {
              setErrors({ submit: "Failed to update product." });
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
                <Field type="number" name="price" required min="0" step="0.01"/>
              </div>
              {errors.submit && <div className="error">{errors.submit}</div>}
              <div className="modal-actions">
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProductModal;
