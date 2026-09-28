const { Router } = require('express');
const { body } = require('express-validator');
const { getMessages, postMessage } = require('../controllers/messageController');

const router = Router();

const messageValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ max: 30 })
    .withMessage('Username must be 30 characters or fewer'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message must be 2000 characters or fewer'),
];

router.get('/', getMessages);
router.post('/', messageValidation, postMessage);

module.exports = router;
