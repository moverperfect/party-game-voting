import { Glicko2 } from 'glicko2';

const settings = {
  tau: 0.5,
  rating: 1500,
  rd: 350,
  vol: 0.06,
};

export const glicko = new Glicko2(settings);

import { Game } from './game';

export function updateRatings(player1: Game, player2: Game, result: number) {
  const player1Glicko = glicko.makePlayer(
    player1.rating,
    player1.rd,
    player1.vol
  );
  const player2Glicko = glicko.makePlayer(
    player2.rating,
    player2.rd,
    player2.vol
  );

  glicko.updateRatings([[player1Glicko, player2Glicko, result]]);

  player1.rating = player1Glicko.getRating();
  player1.rd = player1Glicko.getRd();
  player1.vol = player1Glicko.getVol();

  player2.rating = player2Glicko.getRating();
  player2.rd = player2Glicko.getRd();
  player2.vol = player2Glicko.getVol();

  console.log(player1.name + ' ' + player1.rating);
}
