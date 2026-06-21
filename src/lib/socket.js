import { io } from 'socket.io-client';

// Connects to backend Socket.io server and returns the socket instance.
// Usage: const socket = connectSocket();
export const connectSocket = (opts = {}) => {
  const token = opts.token || localStorage.getItem('accessToken');
  const url = opts.url || '/'; // Vite proxy will forward to backend in dev

  const socket = io(url, {
    path: '/socket.io',
    auth: { token },
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  return socket;
};

export default connectSocket;