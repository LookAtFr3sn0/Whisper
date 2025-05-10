import Sequelize from "sequelize";
import sequelize from "../utils/db.js";
import * as opaque from "@serenity-kit/opaque";
import { v7 as uuidv7 } from "uuid";

const serverSetup = process.env.OPAQUE_SERVER_SETUP as string;
const jwtSecret = process.env.JWT_SECRET as string;

export default async (req, res) => {
  let { username, startLoginRequest } = req.body;
  if (!username || !startLoginRequest) return res.status(400).json({ error: "All fields are required" });
  if (username.length < 3 || username.length > 40 || !/^[a-zA-Z0-9_.-]+$/.test(username)) return res.status(400).json({ error: "Invalid username" });
  username = username.toLowerCase();

  let results, registrationRecord, userId;
  try {
    results = await sequelize.query(
      `SELECT id, registration_record FROM "user".auth WHERE username = :username`,
      {
        replacements: { username },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    registrationRecord = results[0]?.registration_record;
    userId = results[0]?.id;
    if (!registrationRecord) {
      return res.status(400).json({ error: "Invalid username" });
    }
  } catch (err) {
    console.error("Error querying database:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
 
  const { serverLoginState, loginResponse } = opaque.server.startLogin({
    serverSetup,
    userIdentifier: username,
    registrationRecord,
    startLoginRequest,
  });

  try {
    await sequelize.query(
      `INSERT INTO "user".login_state (id, user_id, login_state) VALUES (:id, :userId, :loginState)`,
      {
        replacements: { id: uuidv7(), userId, loginState: serverLoginState },
        type: Sequelize.QueryTypes.INSERT,
      }
    );
  } catch (err) {
    console.error("Error inserting login state into database:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
  return res.status(200).json({ loginResponse });
};