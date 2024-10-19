import React, { useState, useEffect, } from "react";
import ProductCard from "./ProductCard";
import './Products.css'

function Products({onAddToCart}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Set the fetched data to products state
        setProducts(data);
        setLoading(false);
      } catch (err) {
        // Capture any errors
        setError(err.message);
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="product-container">
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart}/>
        ))}
      </div>
    </div>
  );
}

export default Products;

