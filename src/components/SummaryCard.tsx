import React from 'react';
import { Lion } from '../types/lion'; 

interface SummaryCardProps {
  lion: Lion;
}

function SummaryCard({ lion }: SummaryCardProps) {
  return (
    <article className={`profile-card ${lion.isMe ? 'my-card' : ''}`}>
      <div className="image-container">
        <img src="/image.jpg" alt={lion.name} />
        <span className="badge">{lion.skills[0]}</span>
      </div>
      <h2>{lion.name}</h2>
      <h4 className="part-text">{lion.part}</h4>
      <p>{lion.summary}</p>
    </article>
  );
}

export default SummaryCard;