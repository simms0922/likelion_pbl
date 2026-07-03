import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lion } from '../types/lion';
import { transformLionData } from '../utils/transformData';

export const useLions = () => {
  // 프론트엔드에서 사용할 사자 명단 상태
  const [lions, setLions] = useState<Lion[]>([]);
  // 데이터 로딩 상태 (과제 요구사항: 로딩 상태 표시)
  const [isLoading, setIsLoading] = useState(true);

  const fetchLions = async () => {
    setIsLoading(true);
    
    // Supabase의 'lions' 테이블에서 모든 데이터(*)를 가져옵니다.
    const { data, error } = await supabase
      .from('lions')
      .select('*')
      .order('created_at', { ascending: false }); // 최신순 정렬

    if (error) {
      console.error('데이터를 불러오는 중 에러 발생:', error.message);
    } else if (data) {
      // 아까 만든 변환 함수를 사용해 데이터를 프론트엔드용으로 바꿉니다.
      const formattedData = data.map(transformLionData);
      setLions(formattedData);
    }
    
    setIsLoading(false);
  };

  // 훅이 처음 실행될 때 데이터를 바로 불러옵니다.
  useEffect(() => {
    fetchLions();
  }, []);

  return { lions, isLoading, fetchLions };
};