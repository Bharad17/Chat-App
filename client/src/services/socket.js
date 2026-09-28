import { io } from 'socket.io-client';

/**
 * Single shared Socket.io client instance.
 * autoConnect: false — the connection is established explicitly after
 * the user enters a username, preventing anonymous socket connections.
 */
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;
