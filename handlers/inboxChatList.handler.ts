import Sequelize from 'sequelize';
import sequelize from '../utils/db.js';
import { v7 as uuidv7 } from 'uuid';

import auth from '../utils/auth.ts';

export default async (req, res) => {

  const userId = await auth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let { limit = 10, offset = 0 } = req.query;
  limit = Math.max(limit, 20);
  try {
    const results = await sequelize.query(
      `SELECT
        c.id,
        c.is_group,
        c.title,
        m.id AS last_message_id,
        m.ciphertext as last_message,
        m.sender_id,
        m.deleted
      FROM inbox.participants p
      JOIN inbox.conversations c ON c.id = p.chat_id
      LEFT JOIN LATERAL (
        SELECT *
        FROM inbox.messages m
        WHERE m.chat_id = c.id
        ORDER BY m.id DESC
        LIMIT 1
      ) m ON true
      WHERE p.user_id = :userId
      ORDER BY m.id DESC NULLS LAST;`,
      {
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const chatList = results.map((chat) => {
      return {
        id: chat.id,
        isGroup: chat.is_group,
        title: chat.title,
        lastMessage: chat.last_message,
        lastMessageId: chat.last_message_id,
        senderId: chat.sender_id,
        deleted: chat.deleted
      }
    });
    return res.status(200).json(chatList);
  } catch (error) {
    console.error('Error fetching chat list:', error);
    return res.status(500).json({ error: 'Internal Server Error' })
  };
};