import Sequelize from "sequelize";
import sequelize from "./db.js";

export default async (req) => {
  if (!req.cookies) return null;
  const sessionKey = req.cookies.sessionKey;
  if (!sessionKey) return null;
  try {
    const results = await sequelize.query(
      `SELECT a.username FROM "user".auth a
      JOIN "user"."session" s ON a.id = s.user_id
      WHERE s.session_key = :sessionKey
      AND s.revoked = false`,
      {
        replacements: { sessionKey },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (results.length > 0) {
      return results[0]; // username
    }
    return null;
  } catch (error) {
    console.error("Error querying database:", error);
    return null;
  }
};