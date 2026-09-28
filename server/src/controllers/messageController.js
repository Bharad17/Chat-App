const { validationResult } = require('express-validator');
const messageService = require('../services/messageService');

/**
 * GET /api/messages
 * Returns the last 100 messages in a room, oldest first.
 */
async function getMessages(req, res, next) {
  try {
    const messages = await messageService.getMessages();
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/messages
 * Creates a new message (REST utility — normal flow uses Socket.io).
 */
async function postMessage(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, message } = req.body;
    const saved = await messageService.saveMessage(username, message);
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
}

module.exports = { getMessages, postMessage };
