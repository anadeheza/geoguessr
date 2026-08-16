import { useState, useEffect } from 'react'
import { StreetView } from './components/StreetView'
import { GuessMap } from './components/GuessMap'
import { distance, calcScore } from './utils/geo'
import { getRandomView } from './utils/randomView'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_API_KEY 

export default function App() {
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [res, setRes] = useState(null)
  const [currentLoc, setCurrentLoc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNewLocation()
  }, [])

  const loadNewLocation = async () => {
    setLoading(true)
    const newLoc = await getRandomView()
    setCurrentLoc(newLoc)
    setLoading(false)
  }

  const handleGuess = (guessedCoords) => {
    if (!guessedCoords || res || !currentLoc) return

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
    setRound((prev) => prev + 1)
    setRes(null)
    loadNewLocation()
  }

  if (loading || !currentLoc) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#1e293b',
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '24px'
      }}>
        ...
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '5px 15px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ fontWeight: 'bold' }}>Round: {round}</div>
        <div style={{ fontWeight: 'bold' }}>
          Score: <span style={{ color: '#22c55e' }}>{score}</span>
        </div>
      </div>

      <StreetView
        key={`street-${round}`} 
        lat={currentLoc.lat}
        lng={currentLoc.lng}
        apiKey={GOOGLE_MAPS_API_KEY}
      />

      <GuessMap 
        key={`map-${round}`}
        onGuessSubmit={handleGuess} 
        isGuessing={!!res}
        isResult={!!res}
        targetCoords={currentLoc}
      />

      {res && (
        <div style={modalStyle}>
          <h2 style={{ margin: '0 0 10px 0' }}>Result</h2>
          <p>Place: <strong>{currentLoc.name}</strong></p>
          <p>Distance: <strong>{res.distance} km</strong></p>
          <p style={{ fontSize: '18px', color: '#16a34a', fontWeight: 'bold' }}>
            +{res.score} points
          </p>
          <button onClick={handleNext} style={buttonStyle}>
            Next Round
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
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '24px',
  borderRadius: '12px',
  textAlign: 'center',
  zIndex: 3,
  minWidth: '280px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
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