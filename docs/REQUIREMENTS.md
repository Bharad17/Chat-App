# Requirements

## Mandatory Requirements

| # | Requirement | Status |
|---|---|---|
| M01 | React frontend (React + Vite) | TESTED |
| M02 | Clean, user-friendly chat interface | TESTED |
| M03 | Send messages | TESTED |
| M04 | Receive messages in real-time | TESTED |
| M05 | Socket.io for real-time communication | TESTED |
| M06 | Real-time delivery (no refresh needed) | TESTED |
| M07 | Chat history survives page refresh | TESTED |
| M08 | Message timestamps | TESTED |
| M09 | Node.js + Express backend | TESTED |
| M10 | `POST /api/messages` REST endpoint | TESTED |
| M11 | `GET /api/messages` REST endpoint | TESTED |
| M12 | Input validation on API | TESTED |
| M13 | Error handling on API | TESTED |
| M14 | Appropriate HTTP status codes | TESTED |
| M15 | Socket.io connection detection | TESTED |
| M16 | Socket.io disconnection detection | TESTED |
| M17 | Connection failure handled gracefully on frontend | TESTED |
| M18 | Messages persisted to MongoDB | TESTED |
| M19 | Broadcast new messages to all connected clients | TESTED |
| M20 | Clean architecture (routes/controllers/services/models/sockets/middleware) | TESTED |
| M21 | Environment variables (no hardcoded secrets/URLs) | TESTED |
| M22 | README.md with complete documentation | TESTED |

## Bonus Requirements

| # | Requirement | Status |
|---|---|---|
| B01 | Dummy username-based login screen | TESTED |
| B02 | Typing indicator | TESTED |
| B03 | Online / offline user status | TESTED |
| B04 | Delivered status | TESTED |
| B05 | Read status | TESTED |
| B06 | MongoDB persistence | TESTED |
| B07 | Deployment | NOT_IMPLEMENTED |

## Status Legend
- `NOT_STARTED` — not yet worked on
- `IN_PROGRESS` — currently being implemented
- `COMPLETED` — code written
- `TESTED` — manually or automatically verified
- `NOT_IMPLEMENTED` — bonus feature skipped per scope
