import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polyline } from "react-leaflet"
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

function ResizeMap({isHovered}) {
    const map = useMap()
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize()
        }, 300)
        return () => clearTimeout(timer)
    }, [ isHovered, map])
    return null 
}

function FitBounds({ userCoords, targetCoords }) {
    const map = useMap()
    useEffect(() => {
        if (userCoords && targetCoords) {
            const bounds = L.latLngBounds([
                [userCoords.lat, userCoords.lng],
                [targetCoords.lat, targetCoords.lng]
            ])
            map.fitBounds(bounds, { padding: [50, 50] }) 
        }
    }, [userCoords, targetCoords, map])
    return null
}

function LocationMarker({onSelectLocation}) {
    const [pos, setPos] = useState(null)

    useMapEvents({
        click(e) {
            setPos(e.latlng)
            onSelectLocation(e.latlng)
        }
    })

    return pos === null ? null : <Marker position={pos} />
}

export function GuessMap({onGuessSubmit, isGuessing, isResult, targetCoords}) {
    const [selectedPoint, setSelectedPoint] = useState(null)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        if(!isResult) {
            setSelectedPoint(null)
        }
    }, [isResult])

    const isExpanded = isHovered || isResult;

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: isExpanded ? '600px' : '320px',
                height: isExpanded ? '440px' : '240px',
                opacity: isExpanded ? 1 : 0.85,
                zIndex: 1000,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <MapContainer 
                center={[20, 0]} 
                zoom={2} 
                style={{ width: '100%', height: '85%' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                />
                <ResizeMap isHovered={isExpanded} />

                {!isResult && (
                    <LocationMarker onSelectLocation={(coords) => setSelectedPoint(coords)} />
                )}

                {isResult && selectedPoint && targetCoords && (
                    <>
                        <Marker position={[selectedPoint.lat, selectedPoint.lng]} />
                        <Marker position={[targetCoords.lat, targetCoords.lng]} />
                        <Polyline 
                            positions={[
                                [selectedPoint.lat, selectedPoint.lng],
                                [targetCoords.lat, targetCoords.lng]
                            ]}
                            pathOptions={{ color: '#ef4444', weight: 4, dashArray: '6, 8' }}
                        />
                        <FitBounds userCoords={selectedPoint} targetCoords={targetCoords} />
                    </>
                )}
            </MapContainer>

            {!isResult && (
                <button 
                    onClick={() => onGuessSubmit(selectedPoint)}
                    disabled={!selectedPoint || isGuessing}
                    style={{
                        height: '15%',
                        backgroundColor: selectedPoint ? '#22c55e' : '#6b7280',
                        color: 'white',
                        border: 'none',
                        fontSize: isExpanded ? '16px' : '14px',
                        fontWeight: 'bold',
                        cursor: selectedPoint ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s'
                    }}
                >
                    GUESS
                </button>
            )}
        </div>
    )
}