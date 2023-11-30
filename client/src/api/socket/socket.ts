import { Socket, io } from 'socket.io-client';

let socket: any | null = null;

export function initSocket(): void {
  if (!socket) {
    socket = io('http://localhost:8080');
  }
}

export function getSocket(): WebSocket | null {
  return socket;
}

export function closeSocket(): void {
  if (socket) {
    socket.close();
    socket = null;
  }
}
