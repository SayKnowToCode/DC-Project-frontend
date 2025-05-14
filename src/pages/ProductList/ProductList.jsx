import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const baseURL = import.meta.env.VITE_BASE_URL;

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${baseURL}/products/getAll`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
    // setProducts([
    //   { name: "Wireless Headphones", price: 2999, id: 1 },
    //   { name: "Smart Watch", price: 4999, id: 2 },
    //   { name: "Bluetooth Speaker", price: 1999, id: 3 },
    //   { name: "Gaming Mouse", price: 1499, id: 4 }
    // ]);
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="brand-name">ECOMIFY</h1>
      </header>

      <section className="hero-section">
        <h2>Explore the Latest Tech Deals</h2>
        <p>Curated products at unbeatable prices.</p>
      </section>

      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>
            <button onClick={() => navigate(`/product/${p.id}`)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
