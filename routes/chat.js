// const express = require('express');
import express from 'express';
const router = express.Router();
import { renderChatPage, handleMessage } from '../controllers/chatController.js';

router.get('/', renderChatPage);
router.post('/message', handleMessage);

export default router;
