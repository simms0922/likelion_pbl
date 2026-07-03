import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import { useLions } from '../hooks/useLions';
import { supabase } from '../lib/supabase';
import { Lion } from '../types/lion'; 
import { useAuth } from '../hooks/useAuth'; // 👈 로그인 상태를 가져오는 훅 추가!

interface FormData {
  name: string;
  part: string;
  skills: string;
  summary: string;
  detail: string;
  email: string;
  phone: string;
  website: string;
  oneWord: string;
}

function HomePage() {
  const { lions, isLoading, fetchLions } = useLions();
  const { user, logout } = useAuth(); // 👈 현재 로그인한 유저 정보와 로그아웃 함수 가져오기
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const filterPart = searchParams.get('part') || 'all';
  const sortOrder = searchParams.get('sort') || 'newest';
  const searchTerm = searchParams.get('q') || '';
  
  const [fetchStatus, setFetchStatus] = useState<string>('');
  const [lastRequest, setLastRequest] = useState({ count: 0, isReplace: false });

  const updateParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === 'newest' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const displayedLions = lions
    .filter(lion => filterPart === 'all' || lion.part === filterPart)
    .filter(lion => lion.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      return String(b.id).localeCompare(String(a.id));
    });

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchParams.get('q') || '');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams('q', localSearchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [localSearchTerm]);

  const [formData, setFormData] = useState<FormData>({
    name: '', part: 'Frontend', skills: '', summary: '', 
    detail: '', email: '', phone: '', website: '', oneWord: ''
  });

  const handleDeleteLast = async () => {
    if (lions.length === 0) return;
    const lastLion = lions[0]; 
    
    const { error } = await supabase.from('lions').delete().eq('id', lastLion.id as number);
    if (!error) {
      await fetchLions(); 
    } else {
      alert('삭제 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData({ 
      name: '', part: 'Frontend', skills: '', summary: '', 
      detail: '', email: '', phone: '', website: '', oneWord: '' 
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFormOpen) handleCloseForm();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen]);

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isAllFilled = Object.values(formData).every(value => typeof value === 'string' && value.trim() !== '');
    if (!isAllFilled) {
      alert('모든 필드를 빈칸 없이 꼼꼼히 채워주세요!');
      return;
    }

    const { error } = await supabase.from('lions').insert([{
      name: formData.name, 
      part: formData.part, 
      summary: formData.summary,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : ['열정'],
      email: formData.email, 
      phone: formData.phone, 
      website: formData.website,
      intro: formData.detail,
      message: formData.oneWord,
      organization: "멋쟁이사자처럼 14기",
      is_me: false 
    }] as any);

    if (!error) {
      await fetchLions(); 
      handleCloseForm();
    } else {
      alert('추가 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleFillRandom = async () => {
    try {
      const res = await fetch('https://randomuser.me/api/?results=1&nat=us,gb,ca,au,nz');
      if (!res.ok) throw new Error('네트워크 오류');
      const data = await res.json();
      const apiUser = data.results[0];
      
      const randomName = `${apiUser.name.first} ${apiUser.name.last}`;
      const randomPart = ['Frontend', 'Backend', 'Design'][Math.floor(Math.random() * 3)];

      setFormData({
        name: randomName, 
        part: randomPart, 
        skills: 'JavaScript, React, HTML/CSS',
        summary: `${randomPart} · ${apiUser.location.country}에서 합류했어요!`,
        detail: '비동기 데이터를 화면에 그립니다.', 
        email: apiUser.email,
        phone: apiUser.phone, 
        website: `https://example.com/${randomName}`, 
        oneWord: '데이터가 바뀌면 UI도 바뀐다!'
      });
    } catch (error) {
      alert('랜덤 데이터를 불러오는데 실패했습니다.');
    }
  };

  const fetchRandomLions = async (count: number, isReplace = false) => {
    setFetchStatus('불러오는 중...');
    setLastRequest({ count, isReplace });
    try {
      const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
      if (!res.ok) throw new Error('네트워크 오류');
      const data = await res.json();
      
      const newLions = data.results.map((apiUser: any) => {
        const randomName = `${apiUser.name.first} ${apiUser.name.last}`;
        const randomPart = ['Frontend', 'Backend', 'Design'][Math.floor(Math.random() * 3)];
        
        return {
          name: randomName,
          part: randomPart,
          is_me: false,
          summary: `${randomPart} · ${apiUser.location.country}에서 합류했어요!`,
          skills: ['JavaScript', 'React', 'HTML/CSS'],
          intro: '비동기 데이터를 화면에 그립니다.',
          email: apiUser.email,
          phone: apiUser.phone,
          website: `https://example.com/${randomName}`,
          message: '데이터가 바뀌면 UI도 바뀐다!',
          organization: '멋쟁이사자처럼 14기'
        };
      });

      if (isReplace) {
        await supabase.from('lions').delete().eq('is_me', false);
      }

      await supabase.from('lions').insert(newLions);
      await fetchLions(); 
      
      setFetchStatus('불러오기 완료!');
      setTimeout(() => setFetchStatus(''), 3000);
    } catch (error) {
      setFetchStatus('불러오기 실패');
    }
  };

  return (
    <main className="container">
      <section className="control-section">
        
        {/* 1. 이메일 & 로그아웃 (새로 추가된 영역: 우측 정렬) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
          {user ? (
            <>
              <span style={{ color: '#555', fontWeight: 'bold' }}>{user.email}</span>
              <button type="button" onClick={logout} style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}>로그아웃</button>
            </>
          ) : (
            <>
              <span style={{ fontSize: '14px', color: '#666' }}>데이터를 추가하거나 삭제하려면 로그인이 필요해요!</span>
              <button type="button" onClick={() => navigate('/login')} style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}>로그인</button>
            </>
          )}
        </div>

        {/* 2. 원래 디자인 복구: 사자 추가/삭제 & 총 인원수 */}
        <div className="control-top">
          {user && (
            <>
              <button type="button" onClick={() => setIsFormOpen(true)}>아기 사자 추가</button>
              <button type="button" onClick={handleDeleteLast}>마지막 아기 사자 삭제</button>
            </>
          )}
          <p id="countText">총 {lions.length}명</p>
        </div>

        {/* 3. 원래 디자인 복구: 랜덤 추가 & 상태 텍스트 */}
        {user && (
          <div className="api-controls">
            <button type="button" onClick={() => fetchRandomLions(1)} disabled={fetchStatus === '불러오는 중...'}>랜덤 1명 추가</button>
            <button type="button" onClick={() => fetchRandomLions(5)} disabled={fetchStatus === '불러오는 중...'}>랜덤 5명 추가</button>
            <button type="button" onClick={() => fetchRandomLions(lions.filter(lion => !lion.isMe).length || 1, true)} disabled={fetchStatus === '불러오는 중...'}>전체 새로고침</button>
            <span id="statusText">{fetchStatus}</span>
          </div>
        )}

        {/* 4. 원래 디자인 복구: 필터 및 검색 */}
        <div className="view-options">
          <div className="option-group">
            <label>파트</label>
            <select value={filterPart} onChange={(e) => updateParams('part', e.target.value)}>
              <option value="all">전체</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
            </select>
          </div>
          <div className="option-group">
            <label>정렬</label>
            <select value={sortOrder} onChange={(e) => updateParams('sort', e.target.value)}>
              <option value="newest">최신추가순</option>
              <option value="name">이름순</option>
            </select>
          </div>
          <div className="option-group">
            <label>검색</label>
            <input type="text" placeholder="이름으로 검색" value={localSearchTerm} onChange={(e) => setLocalSearchTerm(e.target.value)} />
          </div>
        </div>
        
      </section>

      {/* 폼 부분과 목록 렌더링은 이전과 완벽히 동일합니다 */}
      {isFormOpen && (
        <section className="inline-form-section" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>이름</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>파트</label>
                <select value={formData.part} onChange={(e) => setFormData({ ...formData, part: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>관심 기술</label>
              <input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>한 줄 소개</label>
              <input type="text" value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>자기소개</label>
              <textarea rows={4} value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}></textarea>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Email</label>
                <input type="text" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Phone</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Website</label>
              <input type="text" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>한 마디</label>
              <input type="text" value={formData.oneWord} onChange={(e) => setFormData({ ...formData, oneWord: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={handleFillRandom} style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>랜덤 값 채우기</button>
              <button type="submit" style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>추가하기</button>
              <button type="button" onClick={handleCloseForm} style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>취소</button>
            </div>
          </form>
        </section>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280', marginTop: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>데이터베이스에서 사자들을 불러오는 중입니다... 🦁⏳</h3>
        </div>
      ) : displayedLions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280', marginTop: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>조건에 맞는 아기 사자가 없습니다. 🦁💧</h3>
          <p>검색어나 필터 조건을 다시 확인해 주세요!</p>
        </div>
      ) : (
        <section className="summary-grid">
          {displayedLions.map(lion => (
            <Link 
              key={lion.id} 
              to={`/lions/${lion.id}`} 
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <SummaryCard lion={lion} />
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}

export default HomePage;