# ChatApp — Real-Time Chat Application

A real-time chat application built with **React + Vite** (frontend) and **Node.js + Express + Socket.io** (backend), persisting messages to **MongoDB**.

---

## Features

### Mandatory
- Real-time messaging via Socket.io (no page refresh needed)
- Chat history persisted to MongoDB (survives refresh)
- Message timestamps
- Send / receive messages instantly
- REST API (`GET /api/messages`, `POST /api/messages`)
- Input validation and error handling
- Connection / disconnection detection with UI feedback
- Clean layered architecture

### Bonus
- Username login screen (dummy auth, stored in localStorage)
- Typing indicator (animated, debounced)
- Online user count
- Delivered / Read status indicators on messages

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| Real-time (client) | socket.io-client v4 |
| HTTP client | axios |
| Backend | Node.js 20, Express 4 |
| Real-time (server) | socket.io v4 |
| Database ORM | Mongoose v8 |
| Database | MongoDB (local or Atlas) |
| Validation | express-validator |

---

## Architecture Overview

```
Browser (React + Vite)
  |-- GET /api/messages --------> Express REST API ---> MongoDB
  |-- Socket.io (WebSocket) ----> Socket.io Server ---> MongoDB
                                        |
                                  Broadcast ---> All Connected Clients
```

**Message flow:** The `message:send` Socket.io event is the single source of truth for message creation — it validates, persists to MongoDB, and broadcasts to all clients. `POST /api/messages` is available for REST testing only.

---

## Project Structure

```
realtime-chat/
├── client/                   React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/         ChatContainer, ChatHeader
│   │   │   ├── Message/      MessageList, MessageBubble
│   │   │   ├── Input/        MessageInput
│   │   │   └── common/       ConnectionStatus, TypingIndicator
│   │   ├── pages/            LoginPage, ChatPage
│   │   ├── context/          ChatContext (global state)
│   │   ├── hooks/            useSocket, useMessages
│   │   ├── services/         api.js (axios), socket.js (socket.io-client)
│   │   └── utils/            formatTime.js
│   ├── .env.example
│   └── package.json
│
├── server/                   Node.js + Express backend
│   ├── src/
│   │   ├── config/           database.js
│   │   ├── models/           Message.js
│   │   ├── services/         messageService.js
│   │   ├── controllers/      messageController.js
│   │   ├── routes/           messageRoutes.js
│   │   ├── sockets/          chatSocket.js
│   │   ├── middleware/       errorHandler.js
│   │   ├── utils/            validateEnv.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── REQUIREMENTS.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── ARCHITECTURE.md
│   └── API.md
├── README.md
└── PROJECT_STATUS.md
```

---

## Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **MongoDB** — local instance OR [MongoDB Atlas](https://www.mongodb.com/atlas) free M0 cluster

---

## Installation

```bash
cd realtime-chat
```

## Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env and fill in MONGODB_URI and CLIENT_URL
npm install
```

## Frontend Setup

```bash
cd client
cp .env.example .env
# Edit .env and fill in VITE_API_URL and VITE_SOCKET_URL
npm install
```

---

## Environment Variables

### `server/.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## Running Locally

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

Expected output:
```
[DB] Connected to MongoDB: localhost
[Server] Running on http://localhost:5000
[Server] Accepting connections from http://localhost:5173
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Expected output:
```
VITE v8.3.1  ready in ~200ms
➜  Local: http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## API Overview

### REST Endpoints

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/messages` | Fetch last 100 messages |
| `POST` | `/api/messages` | Create a message (REST / testing) |
| `GET` | `/health` | Health check |

See [`docs/API.md`](docs/API.md) for full request/response schemas.

---

## Socket.io Overview

### Events

| Direction | Event | Description |
|---|---|---|
| Client → Server | `user:join` | Register username on connect |
| Client → Server | `message:send` | Send a new message |
| Client → Server | `typing:start` | User started typing |
| Client → Server | `typing:stop` | User stopped typing |
| Server → Client | `message:receive` | New message broadcast |
| Server → Client | `typing:update` | Typing status change |
| Server → Client | `users:online` | Updated online user list |
| Server → Client | `message:error` | Send failure notification |

See [`docs/API.md`](docs/API.md) for full request/response schemas.

---

## Database Setup

### Local MongoDB

1. Install MongoDB Community Edition
2. Start the service: `mongod` (or via Windows Services)
3. Use URI: `mongodb://localhost:27017/chatapp`

### MongoDB Atlas (free)

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Add your IP to the allowlist (or `0.0.0.0/0` for dev)
4. Create a database user
5. Copy the connection string to `server/.env`

---

## Testing

After starting both servers, verify:

| Test | Steps | Expected |
|---|---|---|
| Username | Open app, enter username, submit | Chat screen opens |
| Send message | Type message, press Enter or Send | Message appears |
| Real-time | Open two tabs, send from one | Other tab receives instantly |
| Persistence | Refresh the page | Previous messages still visible |
| Timestamps | View any message | Time is displayed |
| Empty message | Submit empty input | Error shown, no send |
| Disconnect | Stop the server | Banner shows reconnecting |
| Reconnect | Restart the server | App reconnects automatically |

## Deployment

### Backend Deployment (Render)

1. Create a **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Configure the service:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Set Environment Variables in Render:
   - `PORT`: `5000` (or Render default)
   - `MONGODB_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
   - `CLIENT_URL`: Your Vercel frontend URL (`https://your-app.vercel.app`)

### Frontend Deployment (Vercel)

1. Import your Git repository on [Vercel](https://vercel.com).
2. Configure project settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Set Environment Variables in Vercel:
   - `VITE_API_URL`: Your Render backend URL (`https://your-api.onrender.com`)
   - `VITE_SOCKET_URL`: Your Render backend URL (`https://your-api.onrender.com`)

---

## Design Decisions

1. **Socket.io as message creation source of truth** — prevents duplicate messages that would occur if both REST and socket persisted the same message.
2. **React Context over Redux/Zustand** — app state (messages, users, typing) is shallow enough that Context + hooks covers the full scope with zero extra dependencies.
3. **`autoConnect: false`** on socket — connects only after username is provided, preventing anonymous socket connections.
4. **`express-validator`** for REST validation — declarative and composable without schema duplication.
5. **Server-generated timestamps** — `createdAt` set by Mongoose, never trusted from client.

---

## Assumptions

- Single chat room (`general`) — multi-room is not in scope
- Username is session-based (localStorage), no password or auth system
- Message history is capped at 100 most recent messages
- Read receipts track within the current browser session only

---

## Future Improvements

- Room-based chat (multiple channels)
- Persistent authentication (JWT)
- Message pagination / infinite scroll
- Message reactions / editing / deletion
- Push notifications
- Image / file sharing
- End-to-end encryption
- Deployment (Render + Vercel)
