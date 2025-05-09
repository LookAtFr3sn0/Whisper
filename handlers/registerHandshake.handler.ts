import * as argon2 from 'argon2';
import * as EmailValidator from 'email-validator';
import { v7 as uuidv7 } from 'uuid';
import Sequelize from 'sequelize';
import sequelize from '../utils/db.js';
import * as opaque from "@serenity-kit/opaque";

const serverSetup = process.env.OPAQUE_SERVER_SETUP;

export default async (req, res) => {
  const { username, email, registrationRequest } = req.body;
  if (!username || !email || !registrationRequest) return res.status(400).json({ error: 'All fields are required' });
  if ( username.length < 3 || username.length > 40 || !EmailValidator.validate(email) ) return res.status(400).json({ error: 'Invalid username or email' });

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
  if (results) return res.status(400).json({ error: 'Username taken' });
  try {
    results = await sequelize.query(
      `SELECT * FROM "user".auth WHERE email = :email`,
      {
        replacements: { email },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
  } catch (err) {
    console.error('Error querying database:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  if (results) {
    await new Promise((resolve) => setTimeout(resolve, crypto.randomInt(50, 120)));
    return res.status(200).json({ error: 'Email sent' });
  } else {
    //todo send email to user with code to create account
  }
}