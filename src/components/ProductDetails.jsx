import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get(`${baseURL}/products/getOne/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
    // setProduct({ name: "Product 1", price: 100, id: id });
  }, [id]);

  const handleBuy = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate(`/login`, { state: { from: location.pathname } });
    } else {
      axios.post(`${baseURL}/products/buy`, { username, product_id: parseInt(id) })
        .then(res => alert(res.data.message))
        .catch(err => {
          if (err.response?.status === 401) {
            navigate(`/login`, { state: { from: location.pathname } });
          } else {
            alert("Buy failed");
          }
        });
      // alert("Buy successful");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
}


export default ProductDetails