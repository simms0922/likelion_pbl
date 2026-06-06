import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/style.css'; 
import { lions as initialLions } from './data/lions';
import { transformLionData } from './utils/transformData';

import List from './pages/List';
import Detail from './pages/Detail';

function App() {
  const [lionList, setLionList] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('준비 완료');
  const [lastRequest, setLastRequest] = useState({ count: 1, isReplace: false });

  useEffect(() => {
    setLionList(initialLions);
  }, []);

  const fetchRandomLions = async (count, isReplace = false) => {
    setFetchStatus('불러오는 중...');
    setLastRequest({ count, isReplace }); 
    try {
      const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
      if (!res.ok) throw new Error('네트워크 응답이 올바르지 않습니다.');
      const data = await res.json();
      const newLions = data.results.map(transformLionData);

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
      <Route 
        path="/" 
        element={
          <List 
            lionList={lionList} 
            setLionList={setLionList}
            fetchRandomLions={fetchRandomLions}
            fetchStatus={fetchStatus}
            lastRequest={lastRequest}
          />
        } 
      />
      <Route 
        path="/lions/:id" 
        element={<Detail lionList={lionList} />} 
      />
    </Routes>
  );
}

export default App;