import React from "react";

interface PlayerSheetProps {
  character: {
    name: string;
    class: string;
    level: number;
    actions: string[];
  };
}

export default function PlayerSheet({ character }: PlayerSheetProps) {
  return (
    <aside style={{ background: '#222', padding: '1rem', width: '250px' }}>
      <h2>Player Sheet</h2>
      <p><strong>Name:</strong> {character.name}</p>
      <p><strong>Class:</strong> {character.class}</p>
      <p><strong>Level:</strong> {character.level}</p>
      <p><strong>Actions:</strong></p>
      <ul>
        {character.actions.map((a, i) => <li key={i}>{a}</li>)}
      </ul>
    </aside>
  );
}
