/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [username, setUsername] = useState(() => sessionStorage.getItem('chatUsername') || '');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => {
      if (msg._id && prev.some((m) => m._id === msg._id)) {
        return prev;
      }
      return [...prev, msg];
    });
  }, []);

  const setInitialMessages = useCallback((msgs) => {
    setMessages(msgs);
  }, []);

  const handleUsernameSet = useCallback((name) => {
    sessionStorage.setItem('chatUsername', name);
    setUsername(name);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('chatUsername');
    localStorage.removeItem('chatUsername');
    setUsername('');
  }, []);

  const updateTypingUser = useCallback(({ username: user, isTyping }) => {
    setTypingUsers((prev) =>
      isTyping ? [...new Set([...prev, user])] : prev.filter((u) => u !== user)
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{
        username,
        setUsername: handleUsernameSet,
        messages,
        addMessage,
        setInitialMessages,
        onlineUsers,
        setOnlineUsers,
        typingUsers,
        updateTypingUser,
        isConnected,
        setIsConnected,
        connectionError,
        setConnectionError,
        logout,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}
