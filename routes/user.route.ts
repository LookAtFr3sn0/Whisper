import express from 'express';

import userImage from '../handlers/userImage.handler.ts';

const router = express.Router();

router.get('/image', userImage);

export default router;