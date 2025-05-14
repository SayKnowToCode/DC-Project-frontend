import React from 'react'
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
const baseURL = import.meta.env.VITE_BASE_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = () => {
    axios.post(`${baseURL}/auth/login`, { username, password })
      .then(res => {
        console.log(res.data);
        localStorage.setItem("username", username);
        navigate(from); // redirect back to where we came from
      })
      .catch(err => console.log(err), alert("Invalid credentials"));
    
    localStorage.setItem("username", "user1");
    navigate(from); // redirect back to where we came from
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

export default Login