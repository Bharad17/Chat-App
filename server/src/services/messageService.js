const Message = require('../models/Message');

const DEFAULT_ROOM = 'general';
const DEFAULT_LIMIT = 100;

/**
 * Persists a new message to the database.
 * @param {string} username
 * @param {string} message
 * @param {string} [roomId]
 * @returns {Promise<Message>}
 */
async function saveMessage(username, message, roomId = DEFAULT_ROOM) {
  const doc = new Message({ username, message, roomId, delivered: true });
  return doc.save();
}

/**
 * Retrieves chat history sorted oldest-first.
 * @param {string} [roomId]
 * @param {number} [limit]
 * @returns {Promise<Message[]>}
 */
async function getMessages(roomId = DEFAULT_ROOM, limit = DEFAULT_LIMIT) {
  return Message.find({ roomId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();
}

module.exports = { saveMessage, getMessages };
