import type { NextApiRequest, NextApiResponse } from 'next';
import connection from '../../helpers/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const [games] = await connection.query('SELECT id, name FROM games;');
      const evaluatedMatchups =
        JSON.parse(req.query.evaluatedMatchups as string) || [];

      const isEvaluated = (player1Id, player2Id) => {
        return evaluatedMatchups.some(
          (matchup) =>
            (matchup.player1Id === player1Id &&
              matchup.player2Id === player2Id) ||
            (matchup.player1Id === player2Id && matchup.player2Id === player1Id)
        );
      };

      let player1, player2;

      do {
        player1 = games[Math.floor(Math.random() * games.length)];
        player2 = games[Math.floor(Math.random() * games.length)];
      } while (
        player1.id === player2.id ||
        isEvaluated(player1.id, player2.id)
      );

      res.status(200).json({ player1, player2 });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching games from the database' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
};
