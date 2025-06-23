import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{
      width: '100%',
      padding: '1rem',
      background: '#222',
      color: '#eee',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
