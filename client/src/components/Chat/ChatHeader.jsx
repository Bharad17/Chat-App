import { useChat } from '../../context/ChatContext';

export default function ChatHeader() {
  const { username, onlineUsers, isConnected, logout } = useChat();

  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <div className="chat-logo">💬</div>
        <div>
          <h1 className="chat-title">ChatApp</h1>
          <p className="chat-subtitle">General Room</p>
        </div>
      </div>
      <div className="chat-header-right">
        <div className="online-badge" title={`${onlineUsers.length} online`}>
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
          <span className="online-count">{onlineUsers.length} online</span>
        </div>
        <div className="user-chip">
          <span className="user-avatar">{username.charAt(0).toUpperCase()}</span>
          <span className="user-name">{username}</span>
        </div>
        <button
          className="logout-button"
          onClick={logout}
          title="Switch User / Logout"
          type="button"
        >
          Switch User
        </button>
      </div>
    </header>
  );
}
