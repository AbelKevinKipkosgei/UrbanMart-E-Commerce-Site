import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext'; // Make sure to import your CartContext

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { addToCart } = useContext(CartContext); // Use context to access addToCart function

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('api/products'); // Fetch from the API
        const data = await response.json();
        setAllProducts(data); // Store all products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter results based on the search term
    if (term.length > 2) {
      const filteredResults = allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]); // Clear results if the search term is too short
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {results.map((product) => (
          <li key={product.id}>
            {product.name}
            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
          </li> // Assuming each product has a unique id
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;

