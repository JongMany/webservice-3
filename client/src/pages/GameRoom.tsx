import React, { useEffect, useState } from 'react';
import { SocketProvider, useSocket } from '../context/useSocket';
import useAuthStore from '../store/authStore';
import WaitingRoom from '../component/Game/WaitingRoom';
import { useLocation, useNavigate } from 'react-router-dom';
import Game from '../component/Game/Game';
import useRoomOwnerStore from '../store/roomOwnerStore';

export interface IOther {
  id: string;
  ready: boolean;
}

export default function GameRoom() {
  const [ready, setReady] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const { socket } = useSocket();
  const location = useLocation();
  const { id } = useAuthStore();
  const roomId = location.pathname.split('/')[2];
  const [others, setOthers] = useState<IOther[]>([]);
  const [myTurn, setMyTurn] = useState(false); // 나중에 false로
  const { isOwner, closeRoom } = useRoomOwnerStore();
  const navigate = useNavigate();
  // 내가 들어왔을 때
  socket.on('successEnter', (data: any) => {
    const newForm = data.opposites.map((id: string) => ({
      id: id,
      ready: false,
    }));

    setOthers([...others, ...newForm].filter((item) => item.id !== id));
  });
  useEffect(() => {
    // 누군가가 들어왓을 때
    socket.on('enterRoom', (data: any) => {
      setOthers((prev) =>
        [...prev, { id: data.userId, ready: false }].filter(
          (item) => item.id !== id
        )
      );
    });
    // 누군가가 나갔을 때,
    socket.on('leave', (data: any) => {
      setOthers((prev) => prev.filter((other) => other.id !== data.id));
    });
  }, []);

  useEffect(() => {
    // Ready 버튼을 눌렀을 때,
    socket.on('ready', (data: any) => {
      setOthers(
        others.map((other) =>
          other.id === data.id ? { ...other, ready: data.ready } : other
        )
      );
    });
  }, [socket, others]);

  useEffect(() => {
    const handleUnload = () => {
      // Perform actions before the component unloads
      socket.emit('disconnected', {
        roomId,
        id,
        isOwner: roomId === socket.id,
      });
    };
    socket.on('gameStart', (data: any) => {
      const { id: userId } = data;
      if (id === userId) {
        setMyTurn(true);
      } else {
        setMyTurn(false);
      }
      setAllReady(true);
    });
    window.addEventListener('unload', handleUnload);
    // 나가기
    return () => {
      window.removeEventListener('unload', handleUnload);
      socket.emit('disconnected', {
        roomId,
        id,
        isOwner,
      });
    };
  }, []);

  socket.on('destroyRoom', () => {
    console.log('destroy');

    navigate('/rooms');
    closeRoom();
    socket.emit('disconnected', {
      roomId,
      id,
      isOwner,
    });
  });
  useEffect(() => {}, []);

  return (
    <SocketProvider>
      <>
        {!allReady && (
          <WaitingRoom
            ready={ready}
            setReady={setReady}
            others={others}
            setAllReady={setAllReady}
          />
        )}
        {allReady && <Game myTurn={myTurn} setMyTurn={setMyTurn} />}
      </>
    </SocketProvider>
  );
}
