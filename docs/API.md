# API Documentation

## REST Endpoints

### GET /api/messages

Purpose: Fetch chat history (last 100 messages, sorted oldest-first).

Request: GET /api/messages (no body)

Response 200 OK:
```json
[
  {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "username": "alice",
    "message": "Hello everyone!",
    "roomId": "general",
    "delivered": true,
    "read": false,
    "createdAt": "2026-09-28T04:00:00.000Z"
  }
]
```

Error 500: { "error": "Failed to fetch messages" }

---

### POST /api/messages

Purpose: Create a message via REST (utility/testing). Normal chat uses Socket.io.

Request Body:
```json
{ "username": "alice", "message": "Hello everyone!" }
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| username | string | yes | 1-30 chars |
| message | string | yes | 1-2000 chars |

Response 201 Created: full message document
Response 400: { "errors": [...] }  (validation failure)
Response 500: { "error": "Failed to save message" }

---

## Socket.io Events (v4)

### Client -> Server

#### user:join
Payload: { "username": "alice" }
Server: registers user in online map; broadcasts users:online to all

#### message:send
Payload: { "username": "alice", "message": "Hello!" }
Server: validates -> saves to MongoDB -> io.emit message:receive to all
On error: emits message:error back to sender only

#### typing:start
Payload: { "username": "alice" }
Server: socket.broadcast.emit typing:update { username, isTyping: true }

#### typing:stop
Payload: { "username": "alice" }
Server: socket.broadcast.emit typing:update { username, isTyping: false }

---

### Server -> Client

#### message:receive
Payload: full MongoDB document (see GET /api/messages example)
Client: appends to message list, scrolls to bottom

#### typing:update
Payload: { "username": "alice", "isTyping": true }
Client: shows/hides TypingIndicator for named user

#### users:online
Payload: [ { "socketId": "abc123", "username": "alice" }, ... ]
Client: updates online count in ChatHeader

#### message:error
Payload: { "error": "Message must not be empty." }
Client: shows inline error; preserves input for retry

#### Built-in Socket.io events (client-side)
- connect     -> set isConnected:true, hide error banner
- disconnect  -> set isConnected:false, show reconnecting banner
- connect_error -> show connection error state

---

## Architectural Decision: Socket.io as Message Source of Truth

Messages are created exclusively through message:send Socket.io event.
POST /api/messages is available for REST testing/integrations only.
Reason: prevents duplicate storage and ensures exactly-once delivery to all clients.
