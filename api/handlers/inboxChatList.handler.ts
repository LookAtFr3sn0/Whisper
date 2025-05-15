import Sequelize from 'sequelize';
import sequelize from '../utils/db.js';

type ChatResult = {
  id: string;
  is_group: boolean;
  title: string;
  last_message_id: string;
  last_message: string;
  sender_id: string;
  deleted: boolean;
  participants: string[];
};

export default async (req, res) => {
  const userId = req.userId;
  let { limit = 10, offset = 0 } = req.query;
  limit = Math.max(limit, 20);
  try {
    const results = await sequelize.query<ChatResult>(
      `SELECT
        c.id,
        c.is_group,
        c.title,
        m.id AS last_message_id,
        m.ciphertext as last_message,
        m.sender_id,
        m.deleted,
        (
          SELECT array_agg(a.username)
          FROM inbox.participants p2
          JOIN "user".auth a ON a.id = p2.user_id
          WHERE p2.chat_id = c.id AND p2.user_id != :userId
        ) AS participants
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
    const chatList = (results as ChatResult[]).map((chat) => {
      return {
        id: chat.id,
        isGroup: chat.is_group,
        title: chat.title,
        lastMessage: chat.last_message,
        lastMessageId: chat.last_message_id,
        senderId: chat.sender_id,
        deleted: chat.deleted,
        participants: chat.participants || []
      };
    });
    return res.status(200).json(chatList);
  } catch (error) {
    console.error('Error fetching chat list:', error);
    return res.status(500).json({ error: 'Internal Server Error' })
  };
};