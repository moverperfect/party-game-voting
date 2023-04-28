import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '../../helpers/game';
import db from '../../helpers/db';

export default async (req: NextApiRequest, res: NextApiResponse<Game[]>) => {
  if (req.method === 'GET') {
    try {
      const [gamesData] = await db.query('SELECT * FROM games');
      res.status(200).json(gamesData);
    } catch (error) {
      console.error(error);
      res.status(500).json(null);
    }
  } else {
    res.status(405).json(null);
  }
};
