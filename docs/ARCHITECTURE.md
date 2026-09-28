# Architecture

> This document describes the planned architecture. It will be kept synchronized with the actual implementation.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Real-time (client) | socket.io-client v4 |
| HTTP client | axios |
| Backend | Node.js 20 + Express 5 |
| Real-time (server) | socket.io v4 |
| Database ORM | Mongoose v8 |
| Database | MongoDB Atlas (M0) |
| Input validation | express-validator |

## High-Level Flow

```
React Client (Vite)
  |-- REST GET /api/messages ---------> Express API -----> MongoDB Atlas
  |-- Socket.io (WS) --------------> Socket.io Server --> MongoDB Atlas
                                          |
                                          +--> Broadcast --> All Clients
```

## Frontend Architecture

```
client/src/
  pages/         LoginPage.jsx, ChatPage.jsx
  components/
    Chat/        ChatContainer.jsx, ChatHeader.jsx
    Message/     MessageList.jsx, MessageBubble.jsx
    Input/       MessageInput.jsx
    common/      TypingIndicator.jsx, ConnectionStatus.jsx
  context/       ChatContext.jsx
  hooks/         useSocket.js, useMessages.js
  services/      api.js (axios), socket.js (socket.io-client)
  utils/         formatTime.js
  App.jsx, main.jsx
```

State Management: React Context (ChatContext) — no Redux/Zustand needed.

## Backend Architecture

```
server/src/
  config/        database.js
  models/        Message.js
  services/      messageService.js
  controllers/   messageController.js
  routes/        messageRoutes.js
  sockets/       chatSocket.js
  middleware/    errorHandler.js
  utils/         validateEnv.js
  app.js
  server.js
```

## Database Schema — Message

```
_id        : ObjectId (auto)
username   : String   required, trim, maxLength:30
message    : String   required, trim, maxLength:2000
roomId     : String   default:"general"
delivered  : Boolean  default:false
read       : Boolean  default:false
createdAt  : Date     default:Date.now, indexed desc
```

## Message Lifecycle

```
User types -> emit typing:start (debounced)
           -> [2s idle] -> emit typing:stop
User submits -> emit message:send { username, message }
             -> server validates -> save to MongoDB (delivered:true)
             -> io.emit message:receive { full doc }
             -> all clients append to message list
```

## Connection Lifecycle

```
ChatPage mounts -> socket.connect()
  -> server: "connection" -> emit users:online
  -> client: on("connect") -> isConnected:true

Network drop -> on("disconnect") -> isConnected:false -> reconnecting banner
             -> Socket.io auto-reconnects (exponential backoff)
             -> on("connect") -> emit user:join -> reload missed messages

Browser close -> server: "disconnect" -> remove from online list -> broadcast users:online
```

## Error Handling Strategy

| Layer | Strategy |
|---|---|
| Frontend validation | Inline errors before emit |
| Socket.io server | try/catch per handler; emit message:error to sender |
| Express REST | express-validator + global errorHandler middleware |
| MongoDB | Mongoose errors caught and forwarded to error handler |
| React | Error states in context; user-friendly banners (no stack traces) |
| Missing env vars | validateEnv.js throws on startup |

## Folder Structure Deviations

| Addition | Reason |
|---|---|
| server/src/utils/validateEnv.js | Centralizes env-var guard |
| client/src/utils/formatTime.js | Keeps timestamp formatting out of components |
| client/src/context/ChatContext.jsx | Avoids prop-drilling across deep component tree |

## Deployment Architecture (Planned)

```
Browser --> [Vercel — React static build]
               --> [Render — Node.js server]
                      --> [MongoDB Atlas M0]
```
