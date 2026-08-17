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

  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('highscore')) || 0
  })

  const [bestRound, setBestRound] = useState(0)
  
  const [isNewRecord, setIsNewRecord] = useState(false)

  useEffect(() => {
    loadNewLocation()
  }, [])

  const loadNewLocation = async () => {
    setLoading(true)
    setIsNewRecord(false)
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
    const newTotal = score + roundScore

    setScore(newTotal)
    
    let achieved = false

    if(roundScore > bestRound) {
      setBestRound(roundScore)
      localStorage.setItem('best', roundScore)
      achieved = true
    }

    if(newTotal > highScore) {
      setHighScore(newTotal)
      localStorage.setItem('highscore', newTotal)
      achieved = true
    }

    setIsNewRecord(achieved)

    

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
        backgroundColor: '#000000',
        color: 'white',
        fontSize: '25px'
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
        backgroundColor: '#00000080',
        color: 'white',
        padding: '10px 15px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ fontWeight: 'bold' }}>Round: {round}</div>
        <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
          Score: <span style={{ color: '#72f938' }}>{score}</span>
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          Best Score: <strong style={{ color: '#f59e0b' }}>{highScore}</strong>
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          Best Round: <strong style={{ color: '#f59e0b' }}>{bestRound}</strong>
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
        <div style={modal}>
          {isNewRecord && (
            <div style={badge}>
              New Record!
            </div>
          )}
          <h2 style={{ margin: '0 0 10px 0' }}>Result</h2>
          <p>Place: <strong>{currentLoc.name}</strong></p>
          <p>Distance: <strong>{res.distance} km</strong></p>
          <p style={{ fontSize: '18px', color: '#3d8b28', fontWeight: 'bold' }}>
            +{res.score} points
          </p>
          <button onClick={handleNext} style={button}>
            Next Round
          </button>
        </div>
      )}
    </div>
  );
}

const modal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#ffffffea',
  padding: '20px',
  textAlign: 'center',
  zIndex: 3,
  minWidth: '280px',
  fontFamily: 'sans-serif'
}

const button = {
  marginTop: '15px',
  padding: '10px 20px',
  backgroundColor: '#3d8b28',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
}

const badge = {
  backgroundColor: '#f59e0b',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '15px',
  padding: '5px 10px',
  display: 'inline-block',
  marginBottom: '10px'
}