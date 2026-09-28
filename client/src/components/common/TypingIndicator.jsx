import { useChat } from '../../context/ChatContext';

export default function TypingIndicator() {
  const { typingUsers, username } = useChat();
  // Filter out the current user (shouldn't appear, but safety net)
  const others = typingUsers.filter((u) => u !== username);

  if (others.length === 0) return null;

  const label =
    others.length === 1
      ? `${others[0]} is typing`
      : `${others.slice(0, 2).join(', ')} are typing`;

  return (
    <div className="typing-indicator" aria-live="polite">
      <span className="typing-dots">
        <span /><span /><span />
      </span>
      <span className="typing-label">{label}</span>
    </div>
  );
}
