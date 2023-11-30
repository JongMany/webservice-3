import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Main from './pages/Main';
import MainLayout from './pages/MainLayout';
import Login from './pages/Login';
import Join from './pages/Join';
import GameRoomList from './pages/GameRoomList';
import Record from './pages/Record';
import AuthLayout from './pages/AuthLayout';
import GameRoom from './pages/GameRoom';
import Results from './pages/Results';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import { initSocket } from './api/socket/socket';

function App() {
  const token = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : sessionStorage.getItem('accessToken');
  const navigate = useNavigate();
  const {isLogin} = useAuthStore();
  initSocket();
  
  useEffect(()=>{
    if(!token) {
      navigate('/login');
    } 
  }, [])

  useEffect(() => {
    if(!isLogin) {
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      navigate('/login');
    }
  }, [isLogin])
  
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route path='/' element={<Main />} />
        <Route path='/record' element={<Record />} />

        <Route path='/rooms' element={<GameRoomList />} />
      </Route>
      <Route path='/game/:roomId' element={<GameRoom />} />
      <Route path='results' element={<Results />} />
      <Route path='/' element={<AuthLayout />}>
        <Route path='/login' element={<Login />} />
        <Route path='/join' element={<Join />} />
      </Route>
    </Routes>
  );
}

export default App;
