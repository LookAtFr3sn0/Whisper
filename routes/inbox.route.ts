import express from 'express';

import inboxChatList from '../handlers/inboxChatList.handler.ts';

const router = express.Router();

router.get('/', inboxChatList);

export default router;