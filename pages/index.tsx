import { GameForm } from '../components/GameForm'
import React, { useEffect, useState } from 'react'
import RankedGames from '../components/RankedGames'

const HomePage = () => {
  const [triggerUpdateVar, setTriggerUpdateVar] = useState(1)

  const triggerUpdate = () => {
    setTriggerUpdateVar(triggerUpdateVar + 1)
  }

  return (
    <div>
      <div className='container'>
        <h1 className='display-4 mb-4 text-center'>Game Rankings</h1>
        <div className='d-flex justify-content-center'>
          <GameForm onMatchUpEvaluated={triggerUpdate} />
        </div>
        <RankedGames data={triggerUpdateVar} />
      </div>
    </div>
  )
}

export default HomePage
