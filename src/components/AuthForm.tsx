import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthForm: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true); // true면 로그인, false면 회원가입
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); // 기존 에러 초기화

    // 유효성 검사
    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (isLoginMode) {
      // 🟢 로그인 처리
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setErrorMsg(`로그인 실패 이유: ${error.message}`);
      } else {
        navigate('/'); // 로그인 성공 시 메인(목록) 페이지로 이동
      }
    } else {
      // 🔵 회원가입 처리
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        if (error.message.includes('already registered')) {
          setErrorMsg('이미 가입된 이메일입니다.');
        } else {
            setErrorMsg(`에러 원인: ${error.message}`);
        }
      } else {
        alert('회원가입이 완료되었습니다! 이제 로그인해 주세요.');
        setIsLoginMode(true); // 성공 시 로그인 모드로 전환
        setPassword(''); // 비밀번호 칸 비우기
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isLoginMode ? '로그인' : '회원가입'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>이메일</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>비밀번호 (6자 이상)</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        {/* 에러 메시지가 있으면 빨간 글씨로 띄워줍니다 */}
        {errorMsg && <p style={{ color: 'red', fontSize: '13px', margin: '0' }}>{errorMsg}</p>}

        <button type="submit" style={{ padding: '12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          {isLoginMode ? '로그인하기' : '가입하기'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        <span style={{ color: '#666' }}>
          {isLoginMode ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
        </span>
        <button 
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setErrorMsg('');
          }} 
          style={{ background: 'none', border: 'none', color: '#0066cc', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}
        >
          {isLoginMode ? '회원가입' : '로그인'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;