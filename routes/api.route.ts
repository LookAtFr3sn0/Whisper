import express from 'express';

const router = express.Router();

import registerRoutes from './register.route.ts';
import loginRoutes from './login.route.ts';
import inboxRoutes from './inbox.route.ts';

router.use('/register', registerRoutes);
router.use('/login', loginRoutes);
router.use('/inbox', inboxRoutes);

export default router;