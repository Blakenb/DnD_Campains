import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import React from 'react';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/campaigns', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setCampaigns(res.data));
  }, []);

  const startNew = async () => {
    const gameType = prompt('What kind of campaign do you want to run?') || 'Fantasy';
    const name = prompt('Character Name?') || 'Hero';
    const charClass = prompt('Character Class?') || 'Warrior';

    const res = await axios.post('/api/campaigns/new',
      {
        gameType,
        character: { name, class: charClass, level: 1, actions: [] },
        chatHistory: []
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

    navigate(`/game/${res.data._id}`);
  };

  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center' }}>
        <h1>Campaigns</h1>
        <button onClick={startNew}>Start New Campaign</button>
        <ul>
          {campaigns.map(c => (
            <li key={c._id}>
              {c.character.name} the {c.character.class} 
              <button onClick={() => navigate(`/game/${c._id}`)}>Continue</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
