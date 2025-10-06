'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSocketStore } from '@/stores/socketStore';
import { useAuthStore } from '@/stores/authStore';

export default function SocketInitializer() {
  // Subscribe to changes in the auth token
  const { token } = useAuthStore();
  // Get the current socket instance and the actions to update the store
  const { socket, setSocket, setIsConnected } = useSocketStore();

  useEffect(() => {
    // If there is a token and no active socket connection, create one.
    if (token && !socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
        auth: {
          token: token,
        },
      });

      newSocket.on('connect', () => {
        setSocket(newSocket);
        setIsConnected(true);
        console.log('🔌 Frontend connected and authenticated with WebSocket server!');
      });

      newSocket.on('disconnect', () => {
        setSocket(null);
        setIsConnected(false);
        console.log('🔌 Frontend disconnected from WebSocket server.');
      });
    } 
    // If there is no token but there is an active socket, disconnect it.
    else if (!token && socket) {
      socket.disconnect();
    }
  }, [token, socket, setSocket, setIsConnected]); // Rerun this effect when the token changes

  return null; // This component does not render anything
}