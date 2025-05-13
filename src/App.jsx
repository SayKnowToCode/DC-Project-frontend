import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = "http://dc-project.com/products";
const AUTH_API = "http://dc-project.com/auth";

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/getAll`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
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

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get(`${API_BASE}/getOne/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleBuy = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate(`/login`, { state: { from: location.pathname } });
    } else {
      axios.post(`${API_BASE}/buy`, { username, product_id: parseInt(id) })
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

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = () => {
    axios.post(`${AUTH_API}/login`, { username, password })
      .then(res => {
        localStorage.setItem("username", username);
        navigate(from); // redirect back to where we came from
      })
      .catch(err => alert("Invalid credentials"));
  };

  return (
    <div>
      <h3>Login</h3>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
