/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../helpers/db'

interface MatchupPlayer {
  id: number
  name: string
}

interface EvaluatedMatchup {
  player1Id: number
  player2Id: number
}

type MatchupResponse =
  | { player1: MatchupPlayer, player2: MatchupPlayer }
  | { error: string }

export default async function handler (req: NextApiRequest, res: NextApiResponse<MatchupResponse>): Promise<void> {
  if (req.method === 'GET') {
    try {
      const [games] = await connection.query('SELECT id, name FROM games;') as unknown as [MatchupPlayer[]]
      const evaluatedMatchups =
        ((JSON.parse(req.query.evaluatedMatchups as string) as EvaluatedMatchup[]) ?? [])

      const isEvaluated = (player1Id: number, player2Id: number): boolean => {
        return evaluatedMatchups.some(
          (matchup: EvaluatedMatchup) =>
            (matchup.player1Id === player1Id &&
              matchup.player2Id === player2Id) ||
            (matchup.player1Id === player2Id && matchup.player2Id === player1Id)
        )
      }

      let player1: MatchupPlayer
      let player2: MatchupPlayer

      do {
        player1 = games[Math.floor(Math.random() * games.length)]
        player2 = games[Math.floor(Math.random() * games.length)]
      } while (
        player1.id === player2.id ||
        isEvaluated(player1.id, player2.id)
      )

      res.status(200).json({ player1, player2 })
    } catch (err) {
      res.status(500).json({ error: 'Error fetching games from the database' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ error: `Method ${req.method ?? 'UNKNOWN'} not allowed` })
  }
}
