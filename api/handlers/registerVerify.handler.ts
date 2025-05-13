 import Sequelize from 'sequelize';
import sequelize from '../utils/db.js';
import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import { v7 as uuidv7 } from 'uuid';
import crypto from 'crypto';

export default async (req, res) => {
  const { email, token, registrationRecord } = req.body;
  if (!email || !token || !registrationRecord) return res.status(400).json({ error: 'All fields are required' });
  if (!EmailValidator.validate(email)) return res.status(400).json({ error: 'Invalid email' });
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
      `SELECT * FROM "user".auth WHERE email = :email`,
      {
        replacements: { email },
        type: Sequelize.QueryTypes.SELECT,
      }
    )
    if (results.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, crypto.randomInt(50, 120)));
      return res.status(200).json({ message: 'Email sent' });
    }
  } catch (err) {
    console.error('Error checking email:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  try {
    results = await sequelize.query(
      `INSERT INTO "user".auth (id, username, email, registration_record) VALUES (:id, :username, :email, :registrationRecord) RETURNING username`,
      {
        replacements: { id: uuid, username, email, registrationRecord },
        type: Sequelize.QueryTypes.INSERT,
      }
    );
    return res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error('Error saving registration record:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};