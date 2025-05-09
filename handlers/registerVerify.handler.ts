 import Sequelize from 'sequelize';
import sequelize from '../utils/db.js';
import jwt from 'jsonwebtoken';
import { v7 as uuidv7 } from 'uuid';

export default async (req, res) => {
  const { email, token, registrationRecord } = req.body;
  if (!email || !token || !registrationRecord) return res.status(400).json({ error: 'All fields are required' });
  let username;
  try {
    username = jwt.verify(token, process.env.JWT_SECRET).username;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  if (!username) return res.status(400).json({ error: 'Invalid token' });
  const uuid = uuidv7();
  let results;
  try {
    results = await sequelize.query(
      `INSERT INTO "user".auth (id, username, registration_record) VALUES (:id, :username, :registrationRecord) RETURNING username`,
      {
        replacements: { id: uuid, username, registrationRecord },
        type: Sequelize.QueryTypes.INSERT,
      }
    );
    return res.status(201).json({ success: true, results });
  } catch (err) {
    console.error('Error saving registration record:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};