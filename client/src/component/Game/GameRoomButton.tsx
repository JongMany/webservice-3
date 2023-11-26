import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GameRoomButton() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate('/rooms');
      }}
    >
      게임방 목록보러 가기
    </div>
  );
}
