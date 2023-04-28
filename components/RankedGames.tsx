import React, { useEffect, useState } from 'react';
import { Game } from '../helpers/game';

const RankedGames = ({ data }) => {
  const [games, setGames] = useState<Game[]>([]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data: Game[] = await response.json();
      const sortedData = data.sort((a, b) => b.rating - a.rating);
      setGames(sortedData);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchGames();
    const intervalId = setInterval(() => {
      fetchGames();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [data]);

  return (
    <div className="container">
      <table className="table table-striped table-hover">
        <thead className="thead-light">
          <tr>
            <th scope="col">Rank</th>
            {/* <th scope="col">ID</th> */}
            <th scope="col">Name</th>
            <th scope="col">Rating</th>
            {/* <th scope="col">RD</th>
          <th scope="col">Volatility</th> */}
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={game.id}>
              <td>{index + 1}</td>
              {/* <td>{game.id}</td> */}
              <td>{game.name}</td>
              <td>{game.rating.toFixed(2)}</td>
              {/* <td>{game.rd.toFixed(2)}</td>
            <td>{game.vol.toFixed(2)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankedGames;
