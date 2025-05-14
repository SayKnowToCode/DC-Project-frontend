import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

const baseURL = import.meta.env.VITE_BASE_URL;
const cartURL = "http://dc-project.com/cart";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [inCart, setInCart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get(`${baseURL}/products/getOne/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleBuy = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate(`/login`, { state: { from: location.pathname } });
    } else {
      axios.post(`${baseURL}/products/buy`, {
        username,
        product_id: parseInt(id),
      })
        .then(res => alert(res.data.message))
        .catch(err => {
          if (err.response?.status === 401) {
            navigate(`/login`, { state: { from: location.pathname } });
          } else {
            alert("Buy failed");
          }
        });
    }
  };

  const handleAddToCart = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate(`/login`, { state: { from: location.pathname } });
      return;
    }

    const quantity = prompt("Enter quantity:");
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    const addToCart = async () => {
      try {
        const res = await axios.post(`${cartURL}/add`, {
          username,
          item: {
            product_id: parseInt(id),
            name: product.name,
            price: product.price,
            quantity: parseInt(quantity)
          }
        });
        if (res.status == 200) {
          setInCart(true);
          console.log("added to cart");
        }
        alert("Added to cart");
        setInCart(true);
      } catch (err) {
        console.error(err);
        alert("Failed to add to cart");
      }
    };
    addToCart();

  };

  const handleRemoveFromCart = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate(`/login`, { state: { from: location.pathname } });
      return;
    }

    axios.delete(`${cartURL}/remove`, {
      data: {
        username,
        product_id: parseInt(id)
      }
    })
      .then(res => {
        alert("Removed from cart");
        setInCart(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to remove from cart");
      });
  };

  if (!product) return <p className="loading">Loading...</p>;

  return (
    <div className="product-details-container">
      <div className="product-card">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">₹{product.price}</p>
        <button className="buy-button" onClick={handleBuy}>Buy Now</button>

        {!inCart ? (
          <button className="cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        ) : (
          <button className="cart-remove-button" onClick={handleRemoveFromCart}>
            Remove from Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
