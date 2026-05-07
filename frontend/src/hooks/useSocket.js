// useSocket.js - Custom hook to connect to Socket.IO and listen for notifications
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function useSocket(onNotification) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the backend Socket.IO server
    socketRef.current = io('http://localhost:5000');

    // Listen for 'notification' events emitted by the backend
    socketRef.current.on('notification', (data) => {
      onNotification(data); // pass the notification up to the component
    });

    // Cleanup: disconnect when component unmounts
    return () => {
      socketRef.current.disconnect();
    };
  }, []); // run once on mount
}

export default useSocket;
