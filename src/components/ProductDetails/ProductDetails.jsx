import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

const baseURL = import.meta.env.VITE_BASE_URL;
const cartURL = "http://dc-project.com/cart";

function ProductDetails() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch all products
    axios.get(`${baseURL}/products/getAll`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch cart for the current user
    const username = localStorage.getItem("username");
    if (username) {
      axios.get(`${cartURL}/${username}`)
        .then(res => {
          setCart(res.data || []);
        })
        .catch(err => console.error("Failed to load cart:", err));
    }
  }, []);

  const isInCart = (productId) => {
    return cart.some(item => item.product_id === productId);
  };

  const handleAddToCart = (product) => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate(`/login`, { state: { from: location.pathname } });
      return;
    }

    const quantity = prompt("Enter quantity:");
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      alert("Invalid quantity");
      return;
    }

    const addToCart = async () => {
      try {
        const res = await axios.post(`${cartURL}/add`, {
          username,
          item: {
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: parseInt(quantity)
          }
        });

        if (res.status === 200) {
          // Update local cart state
          const newItem = {
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: parseInt(quantity)
          };

          setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.product_id === product.id);
            if (existingItemIndex >= 0) {
              // Update quantity if item already exists
              const updatedCart = [...prevCart];
              updatedCart[existingItemIndex].quantity += parseInt(quantity);
              return updatedCart;
            } else {
              // Add new item
              return [...prevCart, newItem];
            }
          });

          alert("Added to cart");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to add to cart");
      }
    };
    addToCart();
  };

  const handleRemoveFromCart = (productId) => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate(`/login`, { state: { from: location.pathname } });
      return;
    }

    axios.delete(`${cartURL}/remove`, {
      data: {
        username,
        product_id: parseInt(productId)
      }
    })
      .then(res => {
        setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
        alert("Removed from cart");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to remove from cart");
      });
  };

  const handlePlaceOrder = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate(`/login`, { state: { from: location.pathname } });
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Implement place order functionality
    axios.post(`${cartURL}/placeOrder`, { username })
      .then(res => {
        alert("Order placed successfully!");
        setCart([]);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to place order");
      });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) return <p className="loading">Loading products...</p>;

  return (
    <div className="page-container">
      {/* Products section */}
      <div className="products-section">
        <h2 className="section-title">Products</h2>
        <div className="products-container">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">₹{product.price}</p>
              <div className="product-actions">
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart section */}
      <div className="cart-section">
        <h2 className="section-title">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.product_id} className="cart-item">
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price * item.quantity}</td>
                      <td>
                        <button
                          className="remove-button"
                          onClick={() => handleRemoveFromCart(item.product_id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cart-summary">
              <p className="cart-total">Total: ₹{calculateTotal()}</p>
              <button
                className="place-order-button"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;