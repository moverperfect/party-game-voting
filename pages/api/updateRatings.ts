import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '../../helpers/game';
import { updateRatings } from '../../helpers/fixedMMRHelper';
import db from '../../helpers/db';

interface UpdateRatingsPayload {
  player1Id: number;
  player2Id: number;
  result: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body as UpdateRatingsPayload;

    try {
      const [player1Data] = await db.query('SELECT * FROM games WHERE id = ?', [
        payload.player1Id,
      ]);
      const [player2Data] = await db.query('SELECT * FROM games WHERE id = ?', [
        payload.player2Id,
      ]);

      const player1: Game = player1Data[0];
      const player2: Game = player2Data[0];

      if (player1 && player2) {
        updateRatings(player1, player2, payload.result);

        await db.query(
          'UPDATE games SET rating = ?, rd = ?, vol = ? WHERE id = ?',
          [player1.rating, player1.rd, player1.vol, player1.id]
        );

        await db.query(
          'UPDATE games SET rating = ?, rd = ?, vol = ? WHERE id = ?',
          [player2.rating, player2.rd, player2.vol, player2.id]
        );

        res.status(200).json({ message: 'Ratings updated' });
      } else {
        res.status(400).json({ message: 'Invalid game IDs' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
