import { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';

export default function MessageList({ loading, error }) {
  const { messages } = useChat();
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="message-list-state">
        <div className="spinner" aria-label="Loading messages…" />
        <p>Loading messages…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-list-state error">
        <p>{error}</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="message-list-state empty">
        <p>No messages yet. Say hello! 👋</p>
      </div>
    );
  }

  return (
    <div className="message-list" role="log" aria-label="Chat messages" aria-live="polite">
      {messages.map((msg) => (
        <MessageBubble key={msg._id} msg={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
