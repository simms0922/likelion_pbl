import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import { transformLionData } from '../utils/transformData';

function List({ lionList, setLionList, fetchRandomLions, fetchStatus, lastRequest }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const filterPart = searchParams.get('part') || 'all';
  const sortOrder = searchParams.get('sort') || 'newest';
  const searchTerm = searchParams.get('q') || '';

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === 'all' || value === 'newest' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const displayedLions = lionList
    .filter(lion => filterPart === 'all' || lion.part === filterPart)
    .filter(lion => lion.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      return b.id.localeCompare ? b.id.localeCompare(a.id) : b.id - a.id;
    });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchParams.get('q') || '');
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams('q', localSearchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [localSearchTerm]);
  const [formData, setFormData] = useState({
    name: '', part: 'Frontend', skills: '', summary: '', 
    detail: '', email: '', phone: '', website: '', oneWord: ''
  });

  const handleDeleteLast = () => {
    if (lionList.length === 0) return;
    setLionList((prev) => prev.slice(0, -1));
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData({ 
      name: '', part: 'Frontend', skills: '', summary: '', 
      detail: '', email: '', phone: '', website: '', oneWord: '' 
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFormOpen) handleCloseForm();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const isAllFilled = Object.values(formData).every(value => typeof value === 'string' && value.trim() !== '');
    if (!isAllFilled) {
      alert('모든 필드를 빈칸 없이 꼼꼼히 채워주세요!');
      return;
    }
    const newLion = {
      id: crypto.randomUUID(),
      name: formData.name, part: formData.part, summary: formData.summary,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : ['열정'],
      email: formData.email, phone: formData.phone, website: formData.website,
      oneWord: formData.oneWord, detail: formData.detail, picture: '/image.jpg', isMe: false
    };
    setLionList((prev) => [...prev, newLion]);
    handleCloseForm();
  };

  const handleFillRandom = async () => {
    try {
      const res = await fetch('https://randomuser.me/api/?results=1&nat=us,gb,ca,au,nz');
      if (!res.ok) throw new Error('네트워크 오류');
      const data = await res.json();
      const apiUser = data.results[0];
      const transformed = transformLionData(apiUser);
      setFormData({
        name: transformed.name, part: transformed.part, skills: 'JavaScript, React, HTML/CSS',
        summary: `${transformed.part} · ${transformed.location}에서 합류했어요!`,
        detail: '비동기 데이터를 화면에 그립니다.', email: transformed.email,
        phone: apiUser.phone, website: `https://example.com/${transformed.name}`, oneWord: '데이터가 바뀌면 UI도 바뀐다!'
      });
    } catch (error) {
      alert('랜덤 데이터를 불러오는데 실패했습니다.');
    }
  };

  return (
    <main className="container">
      <section className="control-section">
        <div className="control-top">
          <button type="button" onClick={() => setIsFormOpen(true)}>아기 사자 추가</button>
          <button type="button" onClick={handleDeleteLast}>마지막 아기 사자 삭제</button>
          <p id="countText">총 {lionList.length}명</p>
        </div>

        <div className="api-controls">
          <button type="button" onClick={() => fetchRandomLions(1)} disabled={fetchStatus === '불러오는 중...'}>랜덤 1명 추가</button>
          <button type="button" onClick={() => fetchRandomLions(5)} disabled={fetchStatus === '불러오는 중...'}>랜덤 5명 추가</button>
          <button type="button" onClick={() => fetchRandomLions(lionList.filter(lion => !lion.isMe).length, true)} disabled={fetchStatus === '불러오는 중...'}>전체 새로고침</button>
          <span id="statusText">{fetchStatus}</span>
          {fetchStatus === '불러오기 실패' && (
            <button onClick={() => fetchRandomLions(lastRequest.count, lastRequest.isReplace)} style={{ color: 'red', marginLeft: '5px' }}>재시도</button>
          )}
        </div>

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
            <input 
              type="text" 
              placeholder="이름으로 검색" 
              value={localSearchTerm} 
              onChange={(e) => setLocalSearchTerm(e.target.value)} 
            />
          </div>
        </div>
      </section>

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
              <textarea rows="4" value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}></textarea>
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

      {displayedLions.length === 0 ? (
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

export default List;