import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailCard from '../components/DetailCard';

function Detail({ lionList }) {
  // ⭐ 핵심: URL 주소창에서 id 뽑아오기 (예: /lions/3 이면 id는 3)
  const { id } = useParams(); 
  const navigate = useNavigate();

  // 전체 명단에서 URL의 id와 일치하는 딱 한 명의 사자 찾기
  const targetLion = lionList.find(lion => String(lion.id) === String(id));

  // 주소창에 이상한 번호를 쳤을 때 방어막
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
      
      {/* 뒤로 가기 버튼 (요구사항) */}
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

      {/* 방금 찾은 그 사자의 상세 카드 딱 1장만 그려주기! */}
      <section className="detail-list" style={{ alignItems: 'flex-start' }}>
        <DetailCard lion={targetLion} />
      </section>

    </main>
  );
}

export default Detail;