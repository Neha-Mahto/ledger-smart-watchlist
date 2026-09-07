import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected to real-time market push server');
    });

    socket.on('disconnect', () => {
      console.warn('[Socket.IO] Disconnected from real-time market push server');
    });
  }
  return socket;
}
