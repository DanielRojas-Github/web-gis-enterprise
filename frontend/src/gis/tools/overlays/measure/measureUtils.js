import { calculateDistance }
    from '@/gis/measurements/utils/calculateDistance'

export function calculateTotalDistance(points) { 
    if (points.length < 2) {
        return 0
    }

    let total = 0

    for (let i = 1; i < points.length; i++) {

        total += calculateDistance(
            points[i - 1],
            points[i]
        )
    }

    return total
}