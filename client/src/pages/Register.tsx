import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    await axios.post('/api/auth/register', { email, password });
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className="gothic">Join the Adventure</h1>
      <div>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <br />
        <button onClick={submit}>Register</button>
        <p><Link to="/">Back to Login</Link></p>
      </div>
    </div>
  );
}
