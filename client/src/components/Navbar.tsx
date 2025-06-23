import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
