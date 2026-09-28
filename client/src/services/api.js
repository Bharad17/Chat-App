import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : ''),
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetches the chat history from the REST API.
 * @returns {Promise<Array>}
 */
export async function fetchMessages() {
  const { data } = await api.get('/api/messages');
  return data;
}

/**
 * Posts a message via REST (utility/testing — normal flow uses Socket.io).
 * @param {string} username
 * @param {string} message
 * @returns {Promise<Object>}
 */
export async function postMessage(username, message) {
  const { data } = await api.post('/api/messages', { username, message });
  return data;
}

export default api;
