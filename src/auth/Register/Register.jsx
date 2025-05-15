import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Login/Login.css'; // Reuse the same styles

const baseURL = import.meta.env.VITE_BASE_URL;

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = () => {
        axios.post(`${baseURL}/auth/register`, { username, password })
            .then(res => {
                console.log(res.data);
                alert("Registration successful! Please log in.");
                navigate("/login");
            })
            .catch(err => {
                console.error(err);
                alert("Registration failed. Try a different username.");
            });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Create Account</h2>
                <p className="login-subtitle">Register a new account</p>
                <input
                    className="login-input"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className="login-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="login-button" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
}

export default Register;
