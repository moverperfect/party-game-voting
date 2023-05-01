import { Game } from './game'

const fixedRatingUpdate = 30

export function updateRatings (player1: Game, player2: Game, result: number) {
  if (result === 1) {
    player1.rating += fixedRatingUpdate
    player2.rating -= fixedRatingUpdate
  } else if (result === 0) {
    player1.rating -= fixedRatingUpdate
    player2.rating += fixedRatingUpdate
  } else {
    // Do nothing
  }

  console.log(player1.name + ' ' + player1.rating)
}
