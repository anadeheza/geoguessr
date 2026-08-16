import { setOptions, importLibrary } from "@googlemaps/js-api-loader"

const API_KEY = import.meta.env.VITE_API_KEY
let isConfigured = false

const REGIONS = [
    { name: "Europe", lat: [36, 60], lng: [-9, 25] },
    { name: "North America", lat: [25, 50], lng: [-122, -75] },
    { name: "South America", lat: [-34, -5], lng: [-70, -40] },
    { name: "Japan", lat: [31, 43], lng: [130, 141] },
    { name: "Australia", lat: [-38, -15], lng: [115, 150] }
]

export async function getRandomView() {
    if (!isConfigured && API_KEY) {
        try {
            setOptions({
                key: API_KEY,
                version: "weekly"
            })
            isConfigured = true
        } catch (e) {}
    }

    const { StreetViewService } = await importLibrary("streetView")
    const service = new StreetViewService()

    for (let i = 0; i < 10; i++) {
        const reg = REGIONS[Math.floor(Math.random() * REGIONS.length)]

        const lat = Math.random() * (reg.lat[1] - reg.lat[0]) + reg.lat[0]
        const lng = Math.random() * (reg.lng[1] - reg.lng[0]) + reg.lng[0]

        try {
            const res = await new Promise((resolve, reject) => {
                service.getPanorama(
                    {
                        location: { lat, lng },
                        radius: 50000,
                        source: 'outdoor'
                    },
                    (data, status) => {
                        if (status === 'OK' && data) {
                            resolve(data)
                        } else {
                            reject(status)
                        }
                    }
                )
            })

            const location = res.location
            return {
                lat: location.latLng.lat(),
                lng: location.latLng.lng(),
                name: `${location.description || location.shortDescription || reg.name}`
            }
        } catch {}
    }
    
    return { lat: 48.8584, lng: 2.2945, name: "Paris, France" }
}