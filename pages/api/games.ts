/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Game } from '../../helpers/game'
import db from '../../helpers/db'

type GamesResponse = Game[] | { message: string }

export default async function handler (req: NextApiRequest, res: NextApiResponse<GamesResponse>): Promise<void> {
  if (req.method === 'GET') {
    try {
      const [gamesData] = await db.query('SELECT * FROM games')
      res.status(200).json(gamesData as Game[])
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
