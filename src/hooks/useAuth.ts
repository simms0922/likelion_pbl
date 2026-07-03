import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  // 현재 로그인한 유저 정보를 담을 상태
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. 처음 페이지가 켜졌을 때 현재 세션(로그인 기록)이 있는지 확인
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkSession();

    // 2. 로그인/로그아웃 상태가 바뀔 때마다 자동으로 user 상태 업데이트
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // 컴포넌트가 꺼질 때 감시 종료
    return () => subscription.unsubscribe();
  }, []);

  // 로그아웃 함수
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { user, logout };
};