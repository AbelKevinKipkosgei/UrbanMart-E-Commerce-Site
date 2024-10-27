import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./EditProduct.css"; // Import the CSS file

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [productId, setProductId] = useState("");

  // Fetch all products for the list
  const fetchProductsList = async () => {
    try {
      const response = await fetch("/admin/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProductsList(data);
    } catch (error) {
      console.error("Error fetching products list", error);
    }
  };

  useEffect(() => {
    fetchProductsList(); // Call to fetch products on component mount
  }, []);

  // Fetch the product details based on the product ID
  const fetchProduct = async (id) => {
    try {
      const response = await fetch(`/admin/products/${id}`);
      if (!response.ok) throw new Error("Product not found");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product", error);
      setProduct(null); // Clear product if not found
    }
  };

  const formik = useFormik({
    initialValues: {
      name: product ? product.name : "",
      price: product ? product.price : "",
      image_url: product ? product.image_url : "",
      description: product ? product.description : "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      price: Yup.number().required("Required").positive("Must be positive"),
      image_url: Yup.string().url("Must be a valid URL").required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`api/admin/products/${product.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error("Failed to update product");
        alert("Product updated successfully!");
        setProduct(null); // Clear product state after successful update
        setProductId(""); // Clear input field
        fetchProductsList(); // Refresh the product list
      } catch (error) {
        console.error("Error updating product", error);
      }
    },
  });

  // Handle product ID submission
  const handleProductIdSubmit = (e) => {
    e.preventDefault();
    fetchProduct(productId);
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleProductIdSubmit} className="product-id-form">
        <div>
          <label htmlFor="productId">Enter Product ID</label>
          <input
            id="productId"
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <button type="submit">Fetch Product</button>
        </div>
      </form>

      {product && (
        <form onSubmit={formik.handleSubmit} className="product-form">
          <div>
            <label htmlFor="name">Product Name</label>
            <input id="name" type="text" {...formik.getFieldProps("name")} />
            {formik.touched.name && formik.errors.name ? (
              <div className="error">{formik.errors.name}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              {...formik.getFieldProps("price")}
            />
            {formik.touched.price && formik.errors.price ? (
              <div className="error">{formik.errors.price}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="image_url">Image URL</label>
            <input
              id="image_url"
              type="url"
              {...formik.getFieldProps("image_url")}
            />
            {formik.touched.image_url && formik.errors.image_url ? (
              <div className="error">{formik.errors.image_url}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              {...formik.getFieldProps("description")}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="error">{formik.errors.description}</div>
            ) : null}
          </div>

          <button type="submit">Update Product</button>
        </form>
      )}

      <h2>Product List</h2>
      <div className="products-list">
        {productsList.map((prod) => (
          <div key={prod.id} className="product-card1">
            <img src={prod.image_url} alt={prod.name} />
            <h3>{prod.name}</h3>
            <p>{prod.description}</p>
            <p>Price: ${prod.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditProduct;
