/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Game } from '../../helpers/game'
import { updateRatings } from '../../helpers/fixedMMRHelper'
import db from '../../helpers/db'

interface UpdateRatingsPayload {
  player1Id: number
  player2Id: number
  result: number
}

interface UpdateRatingsResponse {
  message: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<UpdateRatingsResponse>): Promise<void> {
  if (req.method === 'POST') {
    const payload = req.body as UpdateRatingsPayload

    try {
      await db.query('START TRANSACTION;')

      const [player1Data] = await db.query('SELECT * FROM games WHERE id = ? FOR UPDATE;', [
        payload.player1Id
      ]) as unknown as [Game[]]
      const [player2Data] = await db.query('SELECT * FROM games WHERE id = ? FOR UPDATE;', [
        payload.player2Id
      ]) as unknown as [Game[]]

      const player1 = player1Data[0]
      const player2 = player2Data[0]

      if (player1 !== undefined && player2 !== undefined) {
        updateRatings(player1, player2, payload.result)

        await db.query(
          'UPDATE games SET rating = ?, rd = ?, vol = ? WHERE id = ?;',
          [player1.rating, player1.rd, player1.vol, player1.id]
        )

        await db.query(
          'UPDATE games SET rating = ?, rd = ?, vol = ? WHERE id = ?;',
          [player2.rating, player2.rd, player2.vol, player2.id]
        )

        await db.query('COMMIT;')

        res.status(200).json({ message: 'Ratings updated' })
      } else {
        await db.query('ROLLBACK;')

        res.status(400).json({ message: 'Invalid game IDs' })
      }
    } catch (error) {
      console.error(error)

      await db.query('ROLLBACK;')

      res.status(500).json({ message: 'Server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
