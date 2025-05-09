import express from "express";

import loginHandshake from "../handlers/loginHandshake.handler.ts";
import loginVerify from "../handlers/loginVerify.handler.ts";

const router = express.Router();

router.post("/handshake", loginHandshake);
router.post("/verify", loginVerify);

export default router;