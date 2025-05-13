import Sequelize from 'sequelize';
import sequelize from '../utils/db.js';
import * as opaque from "@serenity-kit/opaque";
import jwt from 'jsonwebtoken';

import timeFromUUID from '../utils/timeFromUUID.ts';

const serverSetup = process.env.OPAQUE_SERVER_SETUP as string;
const jwtSecret = process.env.JWT_SECRET as string;

export default async (req, res) => {
  let { username, registrationRequest } = req.body;
  if (!username || !registrationRequest) return res.status(400).json({ error: 'All fields are required' });
  if ( username.length < 3 || username.length > 40 || !/^[a-zA-Z0-9_.-]+$/.test(username) ) return res.status(400).json({ error: 'Invalid username' });
  username = username.toLowerCase();
  
  let results;
  try {
    results = await sequelize.query(
      `SELECT * FROM "user".auth WHERE username = :username`,
      {
        replacements: { username },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
  } catch (err) {
    console.error('Error querying database:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  if (results.length > 0) {
    const user = results[0];
    const createdAtMs = new Date(timeFromUUID(user.id));
    const now = Date.now();

    // Only delete if older than 24 hours AND email has not been verified
    if ((now - createdAtMs.getTime()) > (24 * 60 * 60 * 1000) && !user.email_verified) {
      try {
        await sequelize.query(
          `DELETE FROM "user".auth WHERE username = :username`,
          {
            replacements: { username },
            type: Sequelize.QueryTypes.DELETE,
          }
        );
      } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      results = [];
    } else return res.status(400).json({ error: 'Username taken' });
  }
  
  const { registrationResponse } = opaque.server.createRegistrationResponse({ serverSetup, userIdentifier: username, registrationRequest });
  const token = jwt.sign({ username } , jwtSecret, { expiresIn: '2m' });
  res.status(200).json({ token, registrationResponse });
};