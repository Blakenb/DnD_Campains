import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:5001');

export default function Game() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/api/campaigns/' + id, { headers: { Authorization: 'Bearer ' + token } })
      .then(res => {
        setCampaign(res.data);
        setMessages(res.data.chatHistory);
      });
    socket.emit('join_party', id);
  }, [id]);

  useEffect(() => {
    socket.on('dm_response', msg => {
      setMessages(prev => [...prev, { sender: 'DM', text: msg }]);
    });
    return () => socket.off('dm_response');
  }, []);

  const sendMessage = () => {
    socket.emit('player_action', { campaignId: id, action: input });
    setMessages(prev => [...prev, { sender: 'You', text: input }]);
    setInput('');
  };

  if (!campaign) return <p>Loading...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#121212', color: '#eee' }}>
      <div style={{ flex: 1, padding: '1rem' }}>
        <h1>{campaign.gameType} Adventure</h1>
        <div style={{ border: '1px solid #333', padding: '1rem', height: '70vh', overflowY: 'auto' }}>
          {messages.map((m, i) => <p key={i}><strong>{m.sender}:</strong> {m.text}</p>)}
        
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }}>Logout</button>
    </div>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }}>Logout</button>
    </div>
      <div style={{ width: '300px', borderLeft: '1px solid #333', padding: '1rem' }}>
        <h2>Player Sheet</h2>
        <p>Name: {campaign.character.name}</p>
        <p>Class: {campaign.character.class}</p>
        <p>Level: {campaign.character.level}</p>
        <p>Background: {campaign.character.background}</p>
        <h4>Actions:</h4>
        <ul>
          {campaign.character.actions.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }}>Logout</button>
    </div>
    
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }}>Logout</button>
    </div>
  );
}