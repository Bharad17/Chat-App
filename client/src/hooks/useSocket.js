import { useEffect } from 'react';
import socket from '../services/socket';
import { useChat } from '../context/ChatContext';

/**
 * Manages the Socket.io connection lifecycle.
 * Connects with the user's username and registers top-level event listeners.
 */
export function useSocket() {
  const {
    username,
    addMessage,
    setOnlineUsers,
    updateTypingUser,
    setIsConnected,
    setConnectionError,
  } = useChat();

  useEffect(() => {
    if (!username) return;

    // Connect and announce presence
    socket.connect();
    socket.emit('user:join', { username });

    function onConnect() {
      setIsConnected(true);
      setConnectionError(null);
      // Re-announce after reconnect
      socket.emit('user:join', { username });
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onConnectError(err) {
      setIsConnected(false);
      setConnectionError(err.message || 'Unable to connect to server');
    }

    function onMessageReceive(msg) {
      addMessage(msg);
    }

    function onUsersOnline(users) {
      setOnlineUsers(users);
    }

    function onTypingUpdate({ username: user, isTyping }) {
      updateTypingUser({ username: user, isTyping });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('message:receive', onMessageReceive);
    socket.on('users:online', onUsersOnline);
    socket.on('typing:update', onTypingUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('message:receive', onMessageReceive);
      socket.off('users:online', onUsersOnline);
      socket.off('typing:update', onTypingUpdate);
      socket.disconnect();
    };
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps
}
