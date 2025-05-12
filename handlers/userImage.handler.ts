import Sequelize from 'sequelize';
import sequelize from '../utils/db.js';

import auth from '../utils/auth.js';

export default async (req, res) => {
  const userId = await auth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  //fetch user image
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
    const userImage = results[0].image;
    return res.status(200).json({ image: userImage });
  }
};