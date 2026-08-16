import { useEffect, useRef } from "react"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"

let isApiIn = false;

export function StreetView({ lat, lng, apiKey }) {
    const container = useRef(null)
    const panorama = useRef(null)

    useEffect(() => {
        if (!apiKey) return;

        if(!isApiIn) {
            try{
                setOptions({
                    key: apiKey,
                    version: "weekly"
                })
                isApiIn = true
            } catch(e) { }
        }

        let isMounted = true 

        importLibrary("streetView").then(({ StreetViewPanorama }) => {
            if (!container.current || !isMounted) return

            panorama.current = new StreetViewPanorama(
                container.current,
                {
                    position: { lat, lng },
                    pov: { heading: 0, pitch: 0 },
                    zoom: 1,
                    disableDefaultUI: true,
                    showRoadNames: true,
                    clickToGo: true,
                    addressControl: false,
                }
            )
        })

        return () => {
            isMounted = false;
        }
    }, [lat, lng, apiKey])

    return <div ref={container} style={{ width: '100%', height: '100vh' }} />
}