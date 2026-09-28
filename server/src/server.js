require('dotenv').config();
const http = require('http');
const validateEnv = require('./utils/validateEnv');
const connectDB = require('./config/database');
const app = require('./app');
const initSocket = require('./sockets/chatSocket');

// Validate environment before anything else
validateEnv();

const PORT = process.env.PORT || 5000;

async function start() {
  // Connect to MongoDB
  await connectDB();

  // Create HTTP server and attach Socket.io
  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
    console.log(`[Server] Accepting connections from ${process.env.CLIENT_URL}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received, shutting down...');
    httpServer.close(() => process.exit(0));
  });
}

start().catch((err) => {
  console.error('[Server] Startup failed:', err.message);
  process.exit(1);
});
