import { useState } from 'react'
import { StreetView } from './components/StreetView'
import { GuessMap } from './components/GuessMap'
import { distance, calcScore } from './utils/geo'
import locations  from './data/locations.json'

const GOOGLE_MAPS_API_KEY = import.meta.env.GOOGLE_MAPS_API_KEY 

export default function App() {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [res, setRes] = useState(null)
  const [gameOver, setGameOver] = useState(false)

  const currentLoc = locations[round]
  const handleGuess = (guessedCoords) => {
    if (!guessedCoords || res) return

    const dist = distance(
      currentLoc.lat,
      currentLoc.lng,
      guessedCoords.lat,
      guessedCoords.lng
    )

    const roundScore = calcScore(dist)

    setScore((prev) => prev + roundScore)
    setRes({
      distance: Math.round(dist),
      score: roundScore
    })
  }

  const handleNext = () => {
    if(round + 1 < locations.length) {
      setRound((prev) => prev + 1)
      setRes(null)
    } else {
      setGameOver(true)
    }
  }
  
  const handleRestart = () => {
    setRound(0)
    setScore(0)
    setRes(null)
    setGameOver(false)
  }
  
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ fontWeight: 'bold' }}>Round: {round + 1} / {locations.length}</div>
        <div>Score: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{score}</span></div>
      </div>

      {!gameOver && (
        <StreetView
          key={round} 
          lat={currentLoc.lat}
          lng={currentLoc.lng}
          apiKey={GOOGLE_MAPS_API_KEY}
        />
      )}

      {!res && !gameOver && (
        <GuessMap onGuessSubmit={handleGuess} isGuessing={!!res} />
      )}

      {res && !gameOver && (
        <div style={modalStyle}>
          <h2 style={{ margin: '0 0 10px 0' }}>Result</h2>
          <p>Place: <strong>{currentLoc.name || 'Unknown'}</strong></p>
          <p>Distance: <strong>{res.distance} km</strong></p>
          <p style={{ fontSize: '18px', color: '#16a34a', fontWeight: 'bold' }}>
            +{res.score} points
          </p>
          <button onClick={handleNext} style={buttonStyle}>
            {round + 1 < locations.length ? 'Next Round' : 'See Final Score'}
          </button>
        </div>
      )}

      {gameOver && (
        <div style={modalStyle}>
          <h2>Game Over!</h2>
          <p style={{ fontSize: '20px' }}>
            Final score: <strong>{score}</strong> / {locations.length * 5000}
          </p>
          <button onClick={handleRestart} style={buttonStyle}>
            Play again
          </button>
        </div>
      )}
    </div>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
  textAlign: 'center',
  zIndex: 2000,
  minWidth: '280px',
  fontFamily: 'sans-serif'
}

const buttonStyle = {
  marginTop: '15px',
  padding: '10px 20px',
  backgroundColor: '#22c55e',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
}