import { ReactElement, createContext, useContext, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';

const webSocketUrl = 'http://localhost:8080';
const socketInstance = io('http://localhost:8080', {
  transports: ['websocket'],
});
interface Props {
  children: ReactElement;
}

const SocketContext = createContext<any>({
  socket: socketInstance,
});

export const SocketProvider = ({ children }: Props) => {
  // let socket = useRef<Socket | null>(null);

  // if (!socket.current) {
  //   socket.current = socketInstance;
  // }

  let socket = socketInstance;
  // socket.on('createRoom', (data: any) => {
  //   console.log(data);
  // });

  

  return (
    <SocketContext.Provider value={{ socket: socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
