import { useState } from 'react';
import { useChat } from '../context/ChatContext';

export default function LoginPage() {
  const { setUsername } = useChat();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      setError('Please enter a username.');
      return;
    }
    if (trimmed.length > 30) {
      setError('Username must be 30 characters or fewer.');
      return;
    }
    if (!/^[a-zA-Z0-9_\- ]+$/.test(trimmed)) {
      setError('Username may only contain letters, numbers, spaces, hyphens, and underscores.');
      return;
    }

    setUsername(trimmed);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">💬</div>
        <h1 className="login-title">Welcome to ChatApp</h1>
        <p className="login-subtitle">Enter a username to start chatting</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`form-input ${error ? 'input-error-border' : ''}`}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              placeholder="e.g. alice"
              maxLength={30}
              autoFocus
              autoComplete="username"
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <button type="submit" className="login-button">
            Enter Chat →
          </button>
        </form>
      </div>
    </div>
  );
}
