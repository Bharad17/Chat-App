import { useEffect, useState } from 'react';
import { fetchMessages } from '../services/api';
import { useChat } from '../context/ChatContext';

/**
 * Fetches initial chat history from the REST API on mount.
 * Returns loading / error state for the ChatContainer to display.
 */
export function useMessages() {
  const { setInitialMessages } = useChat();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const history = await fetchMessages();
        if (!cancelled) setInitialMessages(history);
      } catch (err) {
        console.error('Failed to load message history:', err);
        if (!cancelled) setError('Could not load message history. Please refresh.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { loading, error };
}
