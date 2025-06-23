import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    navigate('/campaigns');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className="gothic">Welcome Adventurer</h1>
      <div>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <br />
        <button onClick={submit}>Login</button>
        <p><Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
