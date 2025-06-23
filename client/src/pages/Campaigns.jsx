import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/api/campaigns', { headers: { Authorization: 'Bearer ' + token } })
      .then(res => setCampaigns(res.data));
  }, []);

  const createNew = async () => {
    const gameType = prompt("What kind of campaign would you like to run? (e.g. Epic dragon quest, haunted forest, etc.)");
    const name = prompt("What is your character's name?");
    const charClass = prompt("What is your character's class?");

    const newCampaign = await axios.post('/api/campaigns/new', {
      gameType: gameType || "Adventure",
      character: { 
        name: name || "Hero",
        class: charClass || "Warrior",
        level: 1,
        background: 'Unknown',
        actions: ['Attack', 'Defend']
      }
    }, { headers: { Authorization: 'Bearer ' + token } });

    navigate('/game/' + newCampaign.data._id);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Campaigns</h1>
      <button onClick={createNew}>Start New Campaign</button>
      <ul>
        {campaigns.map(c => (
          <li key={c._id}>
            {c.gameType} - <button onClick={() => navigate('/game/' + c._id)}>Continue</button>
          </li>
        ))}
      </ul>
    
      <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/');
      }}>Logout</button>
    </div>
  );
}