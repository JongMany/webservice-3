import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import Button from '../Button';
import { useSocket } from '../../context/useSocket';
import { useLocation, useNavigate } from 'react-router-dom';
import { IOther } from '../../pages/GameRoom';
import useRoomOwnerStore from '../../store/roomOwnerStore';

import styles from './WaitingRoom.module.css';

interface Props {
  ready: boolean;
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
  others: IOther[];
  setAllReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WaitingRoom({
  ready,
  setReady,
  others,
  setAllReady,
}: Props) {
  const { id } = useAuthStore();
  const { socket } = useSocket();
  const location = useLocation();
  const roomId = location.pathname.split('/')[2];
  const owner = roomId === socket.id;
  const [othersReady, setOthersReady] = useState(false);
  const navigate = useNavigate();
  const { closeRoom, isOwner } = useRoomOwnerStore();

  useEffect(() => {
    const othersAllReady = others.every((other) => other.ready === true);

    // TODO: 나중에 조건 변경
    // if (others.length === 3 && othersAllReady) {
    if (others.length === 1 && othersAllReady) {
      setOthersReady(true);
    } else {
      setOthersReady(false);
    }
  }, [others, ready]);

  const clickHandler = () => {
    // TODO: 나중에 조건 변경
    // if (others.length < 3) {
    if (others.length < 1) {
      alert('2명이 들어온 경우에만 준비완료 버튼을 누를 수 있습니다.');
      return;
    }
    setReady(!ready);
    socket.emit('ready', {
      id,
      roomId,
      ready: !ready,
    });
  };

  // 모두 준비완료여야 시작가능
  return (
    <main className={styles['waiting-room']}>
      <div className={styles['waiting-people']}>
        <div className={styles['waiting-person']}>
          <p>{id}</p>
          <p>{ready ? '준비완료' : '준비중'}</p>
          <Button onClick={clickHandler}>
            {ready ? '준비중' : '준비완료'}
          </Button>
        </div>
        {others.map((other) => (
          <div key={other.id} className={styles['waiting-person']}>
            <p>{other.id}</p>
            <p>{other.ready ? '준비완료' : '준비중'}</p>
          </div>
        ))}
      </div>
      <div>
        {isOwner && (
          <Button
            onClick={() => {
              // TODO: 모두 Ready가 완료되면 조건 추가 (나중에 조건 변경)
              // if (others.length === 3 && ready && othersReady) {
              if (others.length === 1 && ready && othersReady) {
                setAllReady(true);
                socket.emit('gameStart', {
                  roomId,
                  userId: id,
                });
              } else {
                alert('모든 사람이 준비완료되지 않았습니다.');
              }
            }}
          >
            게임 시작
          </Button>
        )}
        <Button
          onClick={() => {
            navigate('/');
            closeRoom();
            socket.emit('disconnected', {
              roomId,
              id,
              isOwner,
            });
          }}
        >
          메인화면으로 이동
        </Button>
        <Button
          onClick={() => {
            navigate('/rooms');
            closeRoom();
            socket.emit('disconnected', {
              roomId,
              id,
              isOwner,
            });
          }}
        >
          게임 목록화면으로 이동
        </Button>
      </div>
    </main>
  );
}
