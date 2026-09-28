import { useState, useRef, useCallback } from 'react';
import socket from '../../services/socket';
import { useChat } from '../../context/ChatContext';

const TYPING_DEBOUNCE_MS = 2000;

export default function MessageInput() {
  const { username, isConnected } = useChat();
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState('');
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  const emitTypingStop = useCallback(() => {
    if (isTypingRef.current) {
      socket.emit('typing:stop', { username });
      isTypingRef.current = false;
    }
  }, [username]);

  function handleChange(e) {
    setText(e.target.value);
    setSendError('');

    // Typing indicator logic
    if (!isTypingRef.current) {
      socket.emit('typing:start', { username });
      isTypingRef.current = true;
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(emitTypingStop, TYPING_DEBOUNCE_MS);
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) {
      setSendError('Message cannot be empty.');
      return;
    }

    emitTypingStop();

    socket.emit('message:send', { username, message: trimmed });

    // Listen for send error (one-time)
    socket.once('message:error', ({ error }) => {
      setSendError(error);
    });

    setText('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const disabled = !isConnected;

  return (
    <div className="message-input-container">
      {sendError && <p className="input-error">{sendError}</p>}
      <div className="message-input-row">
        <textarea
          className="message-textarea"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Reconnecting…' : 'Type a message… (Enter to send)'}
          disabled={disabled}
          maxLength={2000}
          rows={1}
          aria-label="Message input"
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
