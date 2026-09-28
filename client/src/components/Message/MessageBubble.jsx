import { useChat } from '../../context/ChatContext';
import { formatTime, formatFullDateTime } from '../../utils/formatTime';

export default function MessageBubble({ msg }) {
  const { username } = useChat();
  const isOwn = msg.username === username;

  return (
    <div className={`message-row ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && (
        <div className="message-avatar" aria-hidden="true">
          {msg.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="message-bubble-wrap">
        {!isOwn && <span className="message-username">{msg.username}</span>}
        <div className={`message-bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
          <p className="message-text">{msg.message}</p>
          <div className="message-meta">
            <time
              className="message-time"
              dateTime={msg.createdAt}
              title={formatFullDateTime(msg.createdAt)}
            >
              {formatTime(msg.createdAt)}
            </time>
            {isOwn && (
              <span className="message-status" title={msg.read ? 'Read' : msg.delivered ? 'Delivered' : 'Sent'}>
                {msg.read ? '✓✓' : msg.delivered ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
