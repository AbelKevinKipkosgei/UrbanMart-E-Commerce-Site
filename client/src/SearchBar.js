import React, { useState, useEffect } from 'react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // To store all products

  useEffect(() => {
    // Fetch all products on component mount
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products'); // Fetch from the API
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
          <li key={product.id}>{product.name}</li> // Assuming each product has a unique id
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
