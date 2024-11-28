import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Set up the socket connection to your server
const socket = io(`${import.meta.env.VITE_API_URL}`);  // Replace with your server URL

// Create a context
const SocketContext = createContext();

// Create a provider component
export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Listen for connection events
    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  return useContext(SocketContext);
};
