import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/style.css'; 
import { lions as initialLions } from './data/lions';
import { transformLionData } from './utils/transformData';
import { Lion } from './types/lion'; 

import HomePage from './pages/HomePage';       // 이름 변경됨
import DetailPage from './pages/DetailPage';   // 이름 변경됨
import LoginPage from './pages/LoginPage';     // 새로 추가됨

function App() {
  const [lionList, setLionList] = useState<Lion[]>([]);
  const [fetchStatus, setFetchStatus] = useState<string>('준비 완료');
  const [lastRequest, setLastRequest] = useState<{ count: number; isReplace: boolean }>({ count: 1, isReplace: false });

  useEffect(() => {
    setLionList(initialLions);
  }, []);

  const fetchRandomLions = async (count: number, isReplace: boolean = false) => {
    setFetchStatus('불러오는 중...');
    setLastRequest({ count, isReplace }); 
    try {
      const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
      if (!res.ok) throw new Error('네트워크 응답이 올바르지 않습니다.');
      const data = await res.json();
      const newLions: Lion[] = data.results.map(transformLionData);

      if (isReplace) {
        setLionList((prev) => {
          const myCards = prev.filter(lion => lion.isMe); 
          return [...myCards, ...newLions];
        });
      } else {
        setLionList((prev) => [...prev, ...newLions]); 
      }
      setFetchStatus('준비 완료');
    } catch (error) {
      console.error(error);
      setFetchStatus('불러오기 실패');
    }
  };

  return (
    <Routes>
      {/* 복잡했던 Props를 다 지우고 깔끔하게 컴포넌트만 남깁니다! */}
      <Route path="/" element={<HomePage />} />
      <Route path="/lions/:id" element={<DetailPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;