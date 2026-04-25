/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
import { Game } from './game'

const fixedRatingUpdate = 30

export function updateRatings (player1: Game, player2: Game, result: number): void {
  if (result === 1) {
    player1.rating += fixedRatingUpdate
    player2.rating -= fixedRatingUpdate
  } else if (result === 0) {
    player1.rating -= fixedRatingUpdate
    player2.rating += fixedRatingUpdate
  } else {
    // Do nothing
  }
}
