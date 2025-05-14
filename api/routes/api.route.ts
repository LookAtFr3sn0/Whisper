import express from 'express';

const router = express.Router();

import auth from '../middleware/auth.middleware.ts';
import registerRoutes from './register.route.ts';
import loginRoutes from './login.route.ts';
import inboxRoutes from './inbox.route.ts';
import userRoutes from './user.route.ts';

router.use('/register', registerRoutes);
router.use('/login', loginRoutes);

router.use(auth);
router.use('/inbox', inboxRoutes);
router.use('/user', userRoutes);

export default router;