import React from 'react';
import './styles/style.css';
import { lions } from './data/lions';
import SummaryCard from './components/SummaryCard';
import DetailCard from './components/DetailCard';

function App() {
  return (
    <main className="container">
      <section className="control-section">
        <div className="control-top">
          <button type="button">아기 사자 추가</button>
          <button type="button">마지막 아기 사자 삭제</button>
          <p id="countText">총 {lions.length}명</p>
        </div>

        <div className="api-controls">
          <button type="button">랜덤 1명 추가</button>
          <button type="button">랜덤 5명 추가</button>
          <button type="button">전체 새로고침</button>
          <span id="statusText">준비 완료</span>
        </div>

        <div className="view-options">
          <div className="option-group">
            <label>파트</label>
            <select id="filterPart">
              <option value="all">전체</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
            </select>
          </div>
          <div className="option-group">
            <label>정렬</label>
            <select id="sortOrder">
              <option value="newest">최신추가순</option>
              <option value="name">이름순</option>
            </select>
          </div>
          <div className="option-group">
            <label>검색</label>
            <input type="text" id="searchInput" placeholder="이름으로 검색" />
          </div>
        </div>
      </section>

      <section className="summary-grid">
        {lions.map(lion => (
          <SummaryCard key={lion.id} lion={lion} />
        ))}
      </section>

      <hr className="section-divider" />

      <section className="detail-list" style={{ alignItems: 'flex-start' }}>
        {lions.map(lion => (
          <DetailCard key={lion.id} lion={lion} />
        ))}
      </section>
    </main>
  );
}

export default App;