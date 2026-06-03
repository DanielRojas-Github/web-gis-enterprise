export const SNAP_TOLERANCE = 0.005 // Adjust as needed 
export function findNearestVertex(
  targetPoint,
  features
) {

  let nearest = null

  let minDistance =
    Infinity

  features.forEach(
    feature => {

      feature.points.forEach(
        point => {

          const distance =
            Math.sqrt(

              Math.pow(
                point.lat -
                targetPoint.lat,
                2
              )

              +

              Math.pow(
                point.lng -
                targetPoint.lng,
                2
              )
            )

          if (
            distance <
            minDistance
          ) {

            minDistance =
              distance

            nearest =
              point
          }
        }
      )
    }
  )

  if (
    minDistance <
    SNAP_TOLERANCE
  ) {

    return nearest
  }

  return null
}