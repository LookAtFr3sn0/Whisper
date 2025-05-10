import Sequelize from "sequelize";
import sequelize from "../utils/db.js";
import * as opaque from "@serenity-kit/opaque";

const serverSetup = process.env.OPAQUE_SERVER_SETUP as string;
const jwtSecret = process.env.JWT_SECRET as string;

export default async (req, res) => {
  const { username, finishLoginRequest } = req.body;
  
  let results, serverLoginState;
  try {
    results = await sequelize.query(
      `SELECT a.id, ls.login_state FROM "user".auth a
      JOIN "user".login_state ls ON a.id = ls.user_id
      WHERE a.username = :username
      ORDER BY a.id`,
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
    console.error("User ", username, " failed to login");
    return res.status(400).json({ error: "Invalid credentials" });
  }
  return res.status(200).json({ sessionKey });
};