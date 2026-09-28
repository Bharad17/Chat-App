import { io } from 'socket.io-client';

/**
 * Single shared Socket.io client instance.
 * autoConnect: false — the connection is established explicitly after
 * the user enters a username, preventing anonymous socket connections.
 */
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL || (import.meta.env.DEV ? 'http://localhost:5000' : undefined), {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;
