import React, { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AuthLayout() {
  const { isLogin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    } 
  }, [isLogin, navigate]);
  return (
    <div>
      <h1>병뚜껑 튕기기 게임</h1>
      <Outlet />
    </div>
  );
}
