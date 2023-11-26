import { io } from 'socket.io-client';
import Button from '../component/Button';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNetwork } from '../context/useNetwork';
import { SocketProvider, useSocket } from '../context/useSocket';
import useRoomOwnerStore from '../store/roomOwnerStore';
type Room = {
  id: string;
  users: string[];
};
export default function GameRoomList() {
  const { id } = useAuthStore();
  const navigate = useNavigate();
  const { network } = useNetwork();
  const { socket } = useSocket();
  const [rooms, setRooms] = useState<Room[]>([]);
  const {makeRoom} = useRoomOwnerStore();

  // 방 목록 받아오기
  useEffect(() => {
    network
      .findRoom()
      .then((res) => {
        // console.log('rooms', res.data.rooms);
        setRooms(res.data.rooms);
      })
      .catch(console.error);
  }, []);

  // 소켓으로 방 생성하기
  const makeRoomHandler = () => {
    socket.emit('createRoom', {
      id,
    });
    makeRoom(id as string);
  };

  

  const enterRoomHandler = (roomId: string) => () => {
    socket.emit('enterRoom', {
      roomId,
      id,
    });
    navigate(`/game/${roomId}`);
  };

  useEffect(() => {
    socket.on('createRoom', (data: any) => {
      const roomId = data.roomId;
      navigate(`/game/${roomId}`);
    });
    socket.on('roomDeleted', () => {
      network
        .findRoom()
        .then((res) => {
          // console.log('rooms', res.data.rooms);
          setRooms(res.data.rooms);
        })
        .catch(console.error);
    });
    socket.on('roomCreated', () => {
      network
        .findRoom()
        .then((res) => {
          setRooms(res.data.rooms);
        })
        .catch(console.error);
    });
  }, [socket]);

  return (
    <SocketProvider>
      <main>
        <Button onClick={makeRoomHandler}>방 생성하기</Button>
        <ul>
          {rooms?.map((room) => (
            <li key={room.id} onClick={enterRoomHandler(room.id)}>
              {room.id}
            </li>
          ))}
        </ul>
      </main>
    </SocketProvider>
  );
}
