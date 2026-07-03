import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailCard from '../components/DetailCard';
import { Lion } from '../types/lion';
import { supabase } from '../lib/supabase';
import { transformLionData } from '../utils/transformData';

function DetailPage() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  // 1. Supabase에서 받아올 개별 사자 데이터와 로딩 상태를 관리합니다.
  const [lion, setLion] = useState<Lion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. 컴포넌트가 켜질 때 Supabase에서 데이터를 하나만 쏙 가져옵니다.
  useEffect(() => {
    const fetchLionDetail = async () => {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('lions')
        .select('*')
        .eq('id', Number(id))
        .single(); // id가 일치하는 데이터 1개만 가져오기

      if (error) {
        console.error('상세 정보를 불러오는 중 에러 발생:', error.message);
      } else if (data) {
        setLion(transformLionData(data));
      }
      
      setIsLoading(false);
    };

    if (id) {
      fetchLionDetail();
    }
  }, [id]);

  // 3. 로딩 중일 때 보여줄 화면
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>데이터를 불러오는 중입니다... 🦁⏳</h2>
      </div>
    );
  }

  // 4. 데이터를 찾지 못했을 때 보여줄 화면 (기존 UI 유지)
  if (!lion) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>존재하지 않는 아기 사자입니다. 🦁💧</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
          돌아가기
        </button>
      </div>
    );
  }

  // 5. 데이터를 성공적으로 찾았을 때 보여줄 메인 화면 (기존 UI 완벽 유지!)
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
        {/* targetLion 대신 state에 저장된 lion을 넘겨줍니다 */}
        <DetailCard lion={lion} />
      </section>
    </main>
  );
}

// App.tsx에서 DetailPage라는 이름으로 찾을 수 있게 내보냅니다.
export default DetailPage;