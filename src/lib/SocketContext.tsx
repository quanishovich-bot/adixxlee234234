import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Donation {
  id: string;
  amount: number;
  sender: string;
  message: string;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket | null;
  donations: Donation[];
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  donations: [],
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the same origin where the app is hosted
    const newSocket = io(window.location.origin);
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to WebSocket');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    });

    newSocket.on('initial_donations', (data: Donation[]) => {
      setDonations(data);
    });

    newSocket.on('new_donation', (donation: Donation) => {
      setDonations((prev) => [donation, ...prev].slice(0, 100)); // Keep last 100
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, donations, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
