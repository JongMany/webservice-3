import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/useSocket';
import { useLocation } from 'react-router-dom';
import useAuthStore from "../../store/authStore";

export default function Timer() {
  const [time, setTime] = useState(10);
  const { socket } = useSocket();
  const location = useLocation();
  const roomId = location.pathname.split('/')[2];
  const {id} = useAuthStore();

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [time]);

  useEffect(() => {
    if (time < 0) {
      socket.emit('attack', {roomId, value: 0, id })
    }
  });

  return <div>{time} 초</div>;
}
