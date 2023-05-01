import React, { useEffect, useState } from 'react'
import { Game } from '../helpers/game'
import RankedGames from './RankedGames'

const Admin = () => {
  const [triggerUpdateVar, setTriggerUpdateVar] = useState(1)

  return (
    <div>
      <h1>Admin Page</h1>
      <RankedGames data={triggerUpdateVar} />
    </div>
  )
}

export default Admin
