import { io } from 'socket.io-client';

// Connects to backend Socket.io server and returns the socket instance.
// Usage: const socket = connectSocket();
export const connectSocket = (opts = {}) => {
  const token = opts.token || localStorage.getItem('accessToken');
  // Use Vite env var VITE_SOCKET_URL or derive from VITE_API_URL; fallback to '/'
  const envApi = import.meta.env.VITE_API_URL;
  const envSocket = import.meta.env.VITE_SOCKET_URL;
  const defaultUrl = envSocket || (envApi ? new URL(envApi).origin : '/');
  const url = opts.url || defaultUrl;

  const socket = io(url, {
    path: '/socket.io',
    auth: { token },
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  return socket;
};

export default connectSocket;