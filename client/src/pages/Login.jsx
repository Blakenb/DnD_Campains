import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/campaigns');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1 style={{ fontFamily: 'UnifrakturCook, cursive', fontSize: '50px' }}>WELCOME ADVENTURER</h1>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Login</button>
      <p onClick={() => navigate('/register')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
        No account? Register here
      </p>
    </div>
  );
}
