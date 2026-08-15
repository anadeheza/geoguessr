import { useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from "leaflet/dist/images/marker-shadow.png"

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

function LocationMarker({onSelectLoc}) {
    const [pos, setPos] = useState(null)

    useMapEvents({
        click(e) {
            setPos(e.latlng)
            onSelectLoc(e.latlng)
        }
    })

    return pos === null ? null : <Marker position={pos} />
}

export function GuessMap({onGuessSubmit, isGuessing}) {
    const [selectedPoint, setSelectedPoint] = useState(null)

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            width: '320px',
            height: '240px',
            zIndex: 1000,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <MapContainer 
                center={[20, 0]} 
                zoom={2} 
                style={{ width: '100%', height: '80%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onSelectLocation={(coords) => setSelectedPoint(coords)} />
            </MapContainer>

            <button 
                onClick={() => onGuessSubmit(selectedPoint)}
                disabled={!selectedPoint || isGuessing}
                style={{
                    height: '20%',
                    backgroundColor: selectedPoint ? '#22c55e' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: selectedPoint ? 'pointer' : 'not-allowed'
                }}
            >
                GUESS
            </button>
        </div>
    )
}