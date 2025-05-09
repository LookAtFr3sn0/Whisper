import express from "express";
import registerHandshake from "../handlers/registerHandshake.handler.ts";

const router = express.Router();

router.post("/handshake", registerHandshake);

export default router;