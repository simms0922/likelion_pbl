import React from 'react';

function DetailCard({ lion }) {
  return (
    <article className="introduce">
      <div className="info-group">
        <h1>{lion.name}</h1>
        <h3>{lion.part}</h3>
        <h4>{lion.organization}</h4>
      </div>
      <div className="content-section">
        <h3>자기소개</h3>
        <p>{lion.intro}</p>
      </div>
      <div className="content-section">
        <h3>관심 기술</h3>
        <ul>
          {lion.skills.map((skill, index) => <li key={index}>{skill}</li>)}
        </ul>
      </div>
      <div className="content-section">
        <h3>연락처</h3>
        <ul>
          <li>Email: {lion.email}</li>
          <li>Phone: {lion.phone}</li>
          <li>Website: <a href={lion.website}>{lion.website}</a></li>
        </ul>
      </div>
      <div className="content-section">
        <h3>각오</h3>
        <p>{lion.message}</p>
      </div>
    </article>
  );
}
export default DetailCard;