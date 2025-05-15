import Sequelize from "sequelize";
import sequelize from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token ) return res.status(401).send("Unauthorized");

  let sessionKey;
  try {
    sessionKey = jwt.verify(token, process.env.JWT_SECRET).sessionKey;
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const results = await sequelize.query<{id: number, session_id, session_key: string}>(
      `SELECT a.id, s.id as session_id, s.session_key FROM "user".auth a
      JOIN "user"."session" s ON a.id = s.user_id
      WHERE (s.session_key = :sessionKey OR s.prev_session_key = :sessionKey)
      AND s.revoked = false`,
      {
        replacements: { sessionKey },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (results.length == 0) return res.clearCookie("token").status(401).send("Unauthorized");

    const userId = results[0].id;
    const sessionId = results[0].session_id;
    const oldSessionKey = results[0].session_key;
    const newSessionKey = uuidv4();
    req.userId = userId;
    req.sessionId = sessionId;

    const newToken = jwt.sign({ sessionKey: newSessionKey }, process.env.JWT_SECRET, { expiresIn: "28d" });
    res.cookie("token", newToken, { httpOnly: true, secure: true, maxAge: 28 * 24 * 60 * 60 * 1000 });
    await sequelize.query(
      `UPDATE "user"."session" s
      SET session_key = :newSessionKey, prev_session_key = :oldSessionKey
      WHERE s.id = :sessionId`,
      {
        replacements: { newSessionKey, oldSessionKey, sessionId },
        type: Sequelize.QueryTypes.UPDATE,
      }
    );
    next();
  } catch (error) {
    console.error("Error querying database:", error);
    return res.status(500).send("Internal server error");
  }
};