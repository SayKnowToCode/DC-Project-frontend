import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Login from './auth/Login/Login.jsx';
import Register from './auth/Register/Register.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
