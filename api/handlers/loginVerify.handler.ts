import Sequelize from "sequelize";
import sequelize from "../utils/db.js";
import * as opaque from "@serenity-kit/opaque";
import jwt from "jsonwebtoken";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";

export default async (req, res) => {
  const { token, finishLoginRequest, sessionKey: userSessionKey } = req.body;
  if (!token || !finishLoginRequest) return res.status(400).json({ error: "All fields are required" });
  let username;
  try {
    username = jwt.verify(token, process.env.JWT_SECRET).username;
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
  
  let results, serverLoginState;
  try {
    results = await sequelize.query(
      `SELECT a.id, ls.login_state FROM "user".auth a
      JOIN "user".login_state ls ON a.id = ls.user_id
      WHERE a.username = :username`,
      {
        replacements: { username },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (results.length > 0) serverLoginState = results[0].login_state;
    else return res.status(400).json({ error: "Invalid username" });
  } catch (err) {
    console.error("Error querying database:", err);
    return res.status(500).json({ error: "Internal server error" });
  }

  let sessionKey;
  try {
    ({ sessionKey } = opaque.server.finishLogin({
      finishLoginRequest,
      serverLoginState,
    }));
  } catch (err) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  if (sessionKey !== userSessionKey) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const sessionId = uuidv7();
  try {
    await sequelize.query(
      `DELETE FROM "user"."session" WHERE revoked = true AND user_id = (SELECT id FROM "user".auth WHERE username = :username)`,
      {
        replacements: { username },
        type: Sequelize.QueryTypes.DELETE,
      }
    );
    await sequelize.query(
      `INSERT INTO "user"."session" (id, session_key, user_id) VALUES (:id, :sessionKey, (SELECT id FROM "user".auth WHERE username = :username))`,
      {
        replacements: { id: sessionId, sessionKey, username },
        type: Sequelize.QueryTypes.INSERT,
      }
    );
  } catch (err) {
    console.error("Error inserting session into database:", err);
    return res.status(500).json({ error: "Internal server error" });
  };
  try {
    await sequelize.query(
      `DELETE FROM "user".login_state WHERE user_id = (SELECT id FROM "user".auth WHERE username = :username)`,
      {
        replacements: { username },
        type: Sequelize.QueryTypes.DELETE,
      }
    );
  } catch (err) {
    console.error("Error deleting login state from database:", err);
    return res.status(500).json({ error: "Internal server error" });
  }

  const newToken = jwt.sign({ sessionKey }, process.env.JWT_SECRET, { expiresIn: "28d" });

  return res.cookie("token", newToken, { httpOnly: true, secure: true }).status(200).json({ message: "Login successful" });
};