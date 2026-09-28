import { useSocket } from '../../hooks/useSocket';
import { useMessages } from '../../hooks/useMessages';
import ChatHeader from './ChatHeader';
import MessageList from '../Message/MessageList';
import MessageInput from '../Input/MessageInput';
import TypingIndicator from '../common/TypingIndicator';
import ConnectionStatus from '../common/ConnectionStatus';

export default function ChatContainer() {
  // Initialize socket connection and message history
  useSocket();
  const { loading, error } = useMessages();

  return (
    <div className="chat-wrapper">
      <ConnectionStatus />
      <ChatHeader />
      <main className="chat-main">
        <MessageList loading={loading} error={error} />
        <TypingIndicator />
      </main>
      <footer className="chat-footer">
        <MessageInput />
      </footer>
    </div>
  );
}
