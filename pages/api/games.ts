import type { NextApiRequest, NextApiResponse } from 'next'
import { Game } from '../../helpers/game'
import db from '../../helpers/db'
import kv from '@vercel/kv'

export default async (req: NextApiRequest, res: NextApiResponse<Game[]>) => {
  if (req.method === 'GET') {
    const games = await kv.get<Game[]>('default:games')
    if (games != null) {
      res.status(200).json(games)
      return
    }
    try {
      const [gamesData] = await db.query('SELECT * FROM games')
      kv.set('default:games', gamesData)
      res.status(200).json(gamesData)
    } catch (error) {
      console.error(error)
      res.status(500).json(null)
    }
  } else {
    res.status(405).json(null)
  }
}
