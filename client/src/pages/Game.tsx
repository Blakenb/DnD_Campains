/// <reference types="vite/client" />

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/Navbar';

interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL: string;
  };
}

interface Message {
  sender: string;
  text: string;
}

interface Campaign {
  _id: string;
  name: string;
  character: { name: string; class: string };
  gameType: string;
  chatHistory: Message[];
}

export default function Game() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;

    axios.get(`/api/campaigns/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCampaign(res.data);
        setMessages(res.data.chatHistory);
      });

    const s = io(import.meta.env.VITE_API_URL);
    s.emit('join_party', id);
    s.on('dm_response', (text: string) => {
      setMessages(prev => [...prev, { sender: 'DM', text }]);
    });
    setSocket(s);

    return () => { s.disconnect(); };
  }, [id]);

  const send = () => {
    if (!socket || !id || !input.trim()) return;
    setMessages(prev => [...prev, { sender: 'You', text: input }]);
    socket.emit('player_action', { campaignId: id, action: input });
    setInput('');
  };

  if (!campaign) return <h2 style={{ color: 'white' }}>Loading...</h2>;

  return (
    <>
      <Navbar/>
      <div style={{ padding: '2rem', color: 'white' }}>
        <h1>{campaign.name}</h1>
        <h3>{campaign.character.name} the {campaign.character.class}</h3>
        <div style={{ background: '#333', padding: '1rem', height: '300px', overflowY: 'scroll' }}>
          {messages.map((m, i) => (
            <div key={i}><strong>{m.sender}:</strong> {m.text}</div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '70%', marginRight: '1rem' }}
        />
        <button onClick={send}>Send</button>
      </div>
    </>
  );
}
