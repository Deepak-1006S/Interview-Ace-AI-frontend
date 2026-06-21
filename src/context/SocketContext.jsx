import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.DEV
  ? undefined
  : import.meta.env.VITE_API_URL || 'https://interview-ace-ai-backend.onrender.com';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Disconnect any existing socket when user logs out
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
      return;
    }

    // Already connected
    if (socketRef.current?.connected) return;

    const socketOptions = {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    };

    const socket = SOCKET_URL ? io(SOCKET_URL, socketOptions) : io(socketOptions);

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connect error:', err.message);
      setConnected(false);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user?._id]); // re-run only when user changes

  const joinInterview = useCallback((interviewId) => {
    if (!socketRef.current || !user) return;
    socketRef.current.emit('join_interview', {
      interviewId,
      userId: user._id,
      userName: user.name,
    });
  }, [user]);

  const emitTyping = useCallback((interviewId, questionIndex, isTyping) => {
    socketRef.current?.emit('typing', { interviewId, questionIndex, isTyping });
  }, []);

  const emitTimerTick = useCallback((interviewId, elapsed) => {
    socketRef.current?.emit('timer_tick', { interviewId, elapsed });
  }, []);

  // Stable on/off that always uses current socket
  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    socketRef.current?.off(event, handler);
  }, []);

  return (
    <SocketContext.Provider value={{
      connected,
      joinInterview,
      emitTyping,
      emitTimerTick,
      on,
      off,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
