import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export default function MainLayout() {
  const { logout } = useAuthStore();
  const token = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : sessionStorage.getItem('accessToken');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    
    return () => {
      if(!localStorage.getItem('accessToken') && !sessionStorage.getItem('refreshToken')) {
        logout();
      }
    }
  }, [token, navigate]);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
