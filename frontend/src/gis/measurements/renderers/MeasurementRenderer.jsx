import {
  Polyline,
  CircleMarker,
  Tooltip,
} from 'react-leaflet'

import { useGIS }
  from '@/store/gis/hooks/useGIS'

import {
  calculateDistance,
} from '@/gis/measurements/utils/calculateDistance'

const MeasurementRenderer = () => {

  const {
    state,
  } = useGIS()

  const measurements =
    state.measurements
      .filter(
        (point) =>
          Array.isArray(point) &&
          point.length === 2 &&
          point[0] !== undefined &&
          point[1] !== undefined
      )

  if (
    measurements.length === 0
  ) {
    return null
  }

  const distance =
    calculateDistance(
      measurements
    )

  return (
    <>

      {measurements.map(
        (
          point,
          index
        ) => (
          <CircleMarker
            key={index}

            center={point}

            radius={6}
          />
        )
      )}

      {measurements.length > 1 && (

        <Polyline
          positions={
            measurements
          }
        >

          <Tooltip
            permanent
          >

            Distance:
            {' '}
            {distance.toFixed(4)}

          </Tooltip>

        </Polyline>
      )}

    </>
  )
}

export default MeasurementRenderer