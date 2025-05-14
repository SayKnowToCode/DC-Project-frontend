import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // axios.get(`${baseURL}/products/getAll`)
    //   .then(res => setProducts(res.data))
    //   .catch(err => console.error(err));
    setProducts([{"name" : "Product 1", "price": 100, "id": 1}, {"name": "Product 2", "price": 200, "id": 2}])
  }, []);

  return (
    <div>
      <h2>All Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id} style={{ marginBottom: '10px' }}>
            <strong>{p.name}</strong> - ₹{p.price}
            <button style={{ marginLeft: '10px' }} onClick={() => navigate(`/product/${p.id}`)}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;