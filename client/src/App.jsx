import { useChat } from './context/ChatContext';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const { username } = useChat();

  // Route guard: show login until username is set
  return username ? <ChatPage /> : <LoginPage />;
}
