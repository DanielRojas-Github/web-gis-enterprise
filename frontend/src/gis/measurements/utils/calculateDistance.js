export const calculateDistance =
  (points) => {

    if (
      !points ||
      points.length < 2
    ) {
      return 0
    }

    let totalDistance = 0

    for (
      let i = 1;
      i < points.length;
      i++
    ) {

      if (
        !points[i - 1] ||
        !points[i]
      ) {
        continue
      }

      const [
        lat1,
        lng1,
      ] = points[i - 1]

      const [
        lat2,
        lng2,
      ] = points[i]

      if (
        lat1 === undefined ||
        lng1 === undefined ||
        lat2 === undefined ||
        lng2 === undefined
      ) {
        continue
      }

      const dx =
        lat2 - lat1

      const dy =
        lng2 - lng1

      totalDistance +=
        Math.sqrt(
          dx * dx +
          dy * dy
        )
    }

    return totalDistance
  }