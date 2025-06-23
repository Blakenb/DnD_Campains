import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Campaigns from './pages/Campaigns';
import Game from './pages/Game';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
