import { useEffect, memo, useState } from 'react'
import { Game } from '../helpers/game'
import axios from 'axios'

interface GameFormProps {
  onMatchUpEvaluated: () => void
}

export const GameForm: React.FC<GameFormProps> = memo(
  ({ onMatchUpEvaluated }) => {
    const [matchUp, setMatchUp] = useState<{ player1: Game, player2: Game }>({
      player1: {} as Game,
      player2: {} as Game
    })
    const [matchCounter, setMatchCounter] = useState<number>(0)

    const fetchMatchUp = async () => {
      const evaluatedMatchups =
        localStorage.getItem('evaluatedMatchups') || '[]'
      const response = await axios.get(
        `/api/getMatchup?evaluatedMatchups=${encodeURIComponent(
          evaluatedMatchups
        )}`
      )
      setMatchUp(response.data)
      localStorage.setItem(
        'currentMatchup',
        JSON.stringify({
          player1Id: response.data.player1.id,
          player2Id: response.data.player2.id
        })
      )
    }

    const saveEvaluatedMatchup = () => {
      const evaluatedMatchups = JSON.parse(
        localStorage.getItem('evaluatedMatchups') || '[]'
      )
      const { player1Id, player2Id } = JSON.parse(
        localStorage.getItem('currentMatchup') || '{}'
      )
      evaluatedMatchups.push({ player1Id, player2Id })
      localStorage.setItem(
        'evaluatedMatchups',
        JSON.stringify(evaluatedMatchups)
      )
    }

    useEffect(() => {
      const storedMatchCounter = localStorage.getItem('matchCounter')
      if (storedMatchCounter) {
        setMatchCounter(parseInt(storedMatchCounter))
      }

      if (matchCounter <= 50) {
        fetchMatchUp()
      }
    }, [])

    const handleButtonClick = async (result: number) => {
      if (parseInt(localStorage.getItem('matchCounter')) === 50) {
        console.error('Max votes')
        setMatchCounter(parseInt(localStorage.getItem('matchCounter')))
      } else {
        try {
          await axios.post('/api/updateRatings', {
            player1Id: matchUp.player1.id,
            player2Id: matchUp.player2.id,
            result
          })
          onMatchUpEvaluated()
          saveEvaluatedMatchup()
          updateMatchCounter()
          if (matchCounter <= 50) {
            fetchMatchUp()
          }
        } catch (err) {
          console.error('Error updating ratings:', err)
        }
      }
    }

    const updateMatchCounter = () => {
      let newMatchCounter

      if (localStorage.getItem('matchCounter')) {
        newMatchCounter = parseInt(localStorage.getItem('matchCounter')) + 1
      } else {
        newMatchCounter = 1
      }

      setMatchCounter(newMatchCounter)
      localStorage.setItem('matchCounter', newMatchCounter.toString())
      onMatchUpEvaluated()
    }

    return (
      <>
        {matchCounter <= 50
          ? (
            <div className='container'>
              <div className='row'>
                <div className='col text-center'>
                  Votes: {matchCounter}
                  {matchCounter >= 50 ? ' You have reached the max votes' : ''}
                </div>
              </div>
              <div className='row mt-2'>
                <div className='col'>
                  <div className='d-flex justify-content-center'>
                    <button
                      className='btn btn-primary me-2'
                      onClick={async () => await handleButtonClick(1)}
                    >
                      {matchUp.player1.name}
                    </button>
                    <button
                      className='btn btn-warning mx-2'
                      onClick={async () => await handleButtonClick(0.5)}
                    >
                      Draw
                    </button>
                    <button
                      className='btn btn-primary ms-2'
                      onClick={async () => await handleButtonClick(0)}
                    >
                      {matchUp.player2.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <p>All match-ups have been evaluated!</p>
            )}
      </>
    )
  }
)

export default GameForm
