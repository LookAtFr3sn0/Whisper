import Sequelize from 'sequelize';
import sequelize from '../utils/db.js';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  const { token, registrationRecord } = req.body;
  if (!token || !registrationRecord) return res.status(400).json({ error: 'All fields are required' });
  let username;
  try {
    username = jwt.verify(token, process.env.JWT_SECRET).username;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  if (!username) return res.status(400).json({ error: 'Invalid token' });
  return res.status(200).json({ message: 'Token verified successfully' });
};