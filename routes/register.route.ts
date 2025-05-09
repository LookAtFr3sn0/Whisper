import express from "express";
import registerHandshake from "../handlers/registerHandshake.handler.ts";
import registerVerify from "../handlers/registerVerify.handler.ts";

const router = express.Router();

router.post("/handshake", registerHandshake);
router.post("/verify", registerVerify);

export default router;