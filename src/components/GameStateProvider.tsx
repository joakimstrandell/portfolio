'use client'

import { createContext, useState, useContext, ReactNode } from 'react'

type GameStateContextType = {
  gameEnabled: boolean
  gameOver: boolean
  finalScore: number | null
  toggleGame: () => void
  disableGame: () => void
  setGameOver: (over: boolean, score?: number) => void
  resetGame: () => void
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined)

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [gameEnabled, setGameEnabled] = useState(false)
  const [gameOver, setGameOverState] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  
  const toggleGame = () => {
    if (gameOver) {
      // If game is over, reset first
      resetGame()
    } else {
      setGameEnabled(!gameEnabled)
    }
  }
  
  const disableGame = () => setGameEnabled(false)
  
  const setGameOver = (over: boolean, score?: number) => {
    setGameOverState(over)
    if (over && score !== undefined) {
      setFinalScore(score)
    }
    // Don't disable game immediately - let the modal show
  }
  
  const resetGame = () => {
    setGameEnabled(false)
    setGameOverState(false)
    setFinalScore(null)
  }
  
  return (
    <GameStateContext.Provider value={{ 
      gameEnabled, 
      gameOver, 
      finalScore,
      toggleGame, 
      disableGame, 
      setGameOver,
      resetGame 
    }}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}
