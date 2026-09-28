import { useChat } from '../../context/ChatContext';

export default function ConnectionStatus() {
  const { isConnected, connectionError } = useChat();

  if (isConnected) return null;

  return (
    <div className="connection-banner">
      <span className="connection-dot reconnecting" />
      {connectionError
        ? `Connection error: ${connectionError}`
        : 'Reconnecting to server…'}
    </div>
  );
}
