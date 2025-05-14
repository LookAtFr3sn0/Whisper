import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sequelize from '../utils/db.js';

export default async (req, res) => {
  try {
    const results = await sequelize.query(
      `SELECT u.image FROM "user".profile u
      WHERE u.id = :userId;`,
      {
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const imageName = results[0].image;
    const imagePath = path.join('/data/profile_pictures', imageName);
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }
    const image = fs.readFileSync(imagePath);
    res.sendFile(imagePath, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  } catch (error) {
    console.error('Error fetching user image:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  };
};