const { Server } = require('socket.io');
const messageService = require('../services/messageService');

// In-memory map: socketId -> username
const onlineUsers = new Map();

/**
 * Attaches Socket.io to the HTTP server and registers all event handlers.
 * @param {import('http').Server} httpServer
 */
function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ── user:join ─────────────────────────────────────────────────────────────
    socket.on('user:join', ({ username }) => {
      if (!username || typeof username !== 'string') return;
      onlineUsers.set(socket.id, username.trim());
      console.log(`[Socket] ${username} joined (${socket.id})`);
      broadcastOnlineUsers(io);
    });

    // ── message:send ──────────────────────────────────────────────────────────
    socket.on('message:send', async ({ username, message }) => {
      // Validate
      if (!username || !username.trim()) {
        return socket.emit('message:error', { error: 'Username is required.' });
      }
      if (!message || !message.trim()) {
        return socket.emit('message:error', { error: 'Message must not be empty.' });
      }
      if (username.trim().length > 30) {
        return socket.emit('message:error', { error: 'Username must be 30 characters or fewer.' });
      }
      if (message.trim().length > 2000) {
        return socket.emit('message:error', { error: 'Message must be 2000 characters or fewer.' });
      }

      try {
        const saved = await messageService.saveMessage(
          username.trim(),
          message.trim()
        );
        // Broadcast to ALL clients including sender
        io.emit('message:receive', saved);
      } catch (err) {
        console.error('[Socket] message:send error:', err.message);
        socket.emit('message:error', { error: 'Failed to send message. Please try again.' });
      }
    });

    // ── typing:start ──────────────────────────────────────────────────────────
    socket.on('typing:start', ({ username }) => {
      if (!username) return;
      socket.broadcast.emit('typing:update', { username, isTyping: true });
    });

    // ── typing:stop ───────────────────────────────────────────────────────────
    socket.on('typing:stop', ({ username }) => {
      if (!username) return;
      socket.broadcast.emit('typing:update', { username, isTyping: false });
    });

    // ── disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      const username = onlineUsers.get(socket.id) || 'Unknown';
      console.log(`[Socket] Disconnected: ${username} (${socket.id}) — ${reason}`);
      onlineUsers.delete(socket.id);
      broadcastOnlineUsers(io);
    });
  });

  return io;
}

/** Emits the current online users list to all connected clients. */
function broadcastOnlineUsers(io) {
  const users = Array.from(onlineUsers.entries()).map(([socketId, username]) => ({
    socketId,
    username,
  }));
  io.emit('users:online', users);
}

module.exports = initSocket;
