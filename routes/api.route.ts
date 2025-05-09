import express from 'express';

const router = express.Router();

import registerRoutes from './register.route.js';
import loginRoutes from './login.route.js';

router.use('/register', registerRoutes);
router.use('/login', loginRoutes);

export default router;