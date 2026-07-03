import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  return (
    <main className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <AuthForm />
    </main>
  );
};

export default LoginPage;