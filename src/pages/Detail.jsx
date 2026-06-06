import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailCard from '../components/DetailCard';

function Detail({ lionList }) {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const targetLion = lionList.find(lion => String(lion.id) === String(id));

  if (!targetLion) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>존재하지 않는 아기 사자입니다. 🦁💧</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <main className="container" style={{ paddingTop: '40px' }}>

      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          marginBottom: '30px', 
          padding: '10px 20px', 
          backgroundColor: '#f3f4f6', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer', 
          fontWeight: 'bold' 
        }}
      >
        ← 목록으로 돌아가기
      </button>

      <section className="detail-list" style={{ alignItems: 'flex-start' }}>
        <DetailCard lion={targetLion} />
      </section>

    </main>
  );
}

export default Detail;