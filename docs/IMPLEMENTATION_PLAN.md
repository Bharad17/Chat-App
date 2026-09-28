# Implementation Plan

## Phase 1 — Project Setup

### 1.1 Repository Structure
- Create client/ (React + Vite) and server/ (Node.js + Express) directories
- Create root .gitignore covering node_modules, .env, dist, build artifacts
- Create .env.example files for both client and server

### 1.2 Backend Initialization
- npm init inside server/
- Install: express, mongoose, socket.io, cors, dotenv, express-validator
- Install dev: nodemon
- Configure package.json scripts: start, dev

### 1.3 Frontend Initialization
- npm create vite@latest client -- --template react
- Install: socket.io-client, axios
- Remove Vite boilerplate

### 1.4 Environment Variables
- server/.env: PORT, MONGODB_URI, CLIENT_URL
- client/.env: VITE_API_URL, VITE_SOCKET_URL

---

## Phase 2 — Database

### 2.1 MongoDB Connection
- server/src/config/database.js — Mongoose connect with retry logic and event logging
- Load MONGODB_URI from environment; throw if missing

### 2.2 Message Model
Fields: _id, username, message, createdAt, roomId, delivered, read
Index on createdAt (descending) for efficient history queries

---

## Phase 3 — REST API

### 3.1 Message Service (server/src/services/messageService.js)
- saveMessage(username, message, roomId)
- getMessages(roomId, limit, skip)

### 3.2 Message Controller (server/src/controllers/messageController.js)
- postMessage — validates, calls service, returns 201
- getMessages — calls service, returns 200 with array

### 3.3 Routes (server/src/routes/messageRoutes.js)
- POST /api/messages
- GET  /api/messages

### 3.4 Validation Middleware
- express-validator: username (1-30 chars), message (1-2000 chars)

### 3.5 Error Handler (server/src/middleware/errorHandler.js)
- Returns structured JSON { error: message } with appropriate status

---

## Phase 4 — Socket.io

### 4.1 Socket Server (server/src/sockets/chatSocket.js)
- Attach Socket.io to HTTP server
- Configure CORS to match CLIENT_URL

### 4.2 Event Handlers
Client->Server: message:send, typing:start, typing:stop, user:join
Server->Client: message:receive, typing:update, users:online, message:error

### 4.3 Message Source of Truth
Socket.io is the single source of truth for message creation.
POST /api/messages is kept for REST completeness/testing only.

---

## Phase 5 — Frontend

### 5.1 Pages
- LoginPage.jsx — username input + validation
- ChatPage.jsx — full chat view, protected route

### 5.2 Context
- ChatContext.jsx — username, messages, onlineUsers, typingUsers, socket state

### 5.3 Services
- socket.js — single shared Socket.io instance (autoConnect: false)
- api.js — Axios wrapper for REST calls

### 5.4 Components
- Chat/ChatContainer.jsx, Chat/ChatHeader.jsx
- Message/MessageList.jsx, Message/MessageBubble.jsx
- Input/MessageInput.jsx
- common/TypingIndicator.jsx, common/ConnectionStatus.jsx

### 5.5 Hooks
- useSocket.js — socket lifecycle and state
- useMessages.js — message list management

---

## Phase 6 — Bonus Features

- Typing indicator (typing:start / typing:stop events)
- Online/offline status (users:online event)
- Delivered/Read status (flags on Message model)

---

## Phase 7 — Testing

Manual tests: username entry, send, two-tab realtime, refresh persistence,
timestamps, empty message rejection, disconnect UI, reconnect, MongoDB check

---

## Phase 8 — Documentation

- Finalize README.md, API.md, ARCHITECTURE.md
- Sync REQUIREMENTS.md statuses
- Update PROJECT_STATUS.md

---

## Phase 9 — Deployment (Bonus)

- Backend: Render (Node.js + WebSockets)
- Frontend: Vercel (static React build)
- Database: MongoDB Atlas (M0 free cluster)
