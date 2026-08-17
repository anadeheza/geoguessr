export function distance(lat1, lng1, lat2, lng2) {
    const radio = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) /180

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) /180) * Math.pow((Math.sin(dLng / 2)), 2)

    const angulo = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distancia = radio * angulo

    return distancia
}


export function calcScore(distKM) {
    const maxDist = 20000

    if(distKM <= 0.05) return 5000

    const score = 5000 * Math.exp(-10 * (distKM / maxDist))
    return Math.max(0, Math.round(score))
}

