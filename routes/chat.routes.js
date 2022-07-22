const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller')

router.get('/messages/:chatId',chatController.showChatConv)
router.post('/start/:userId',chatController.chatSart)

module.exports = router;