import {
  Polyline,
  Marker,
  Popup,
} from 'react-leaflet'

import {
  useEffect,
  useState,
} from 'react'

import { measureState }
  from './measureStore'

import { calculateTotalDistance }
  from './measureUtils'

export default function MeasureOverlay() {

  const [, forceUpdate] = useState(0)

  useEffect(() => {
    return measureState.subscribe(() => {
      forceUpdate(v => v + 1)
    })
  }, [])

  if (measureState.points.length < 2) {
    return null
  }

  const totalDistance =
    calculateTotalDistance(
      measureState.points
    )

  return (
    <>
      <Polyline
        positions={measureState.points}
        pathOptions={{
          color: 'red',
          weight: 4,
        }}
      />

      <Marker
        position={
          measureState.points[
            measureState.points.length - 1
          ]
        }
      >
        <Popup>
          Distancia:
          {' '}
          {(totalDistance / 1000).toFixed(2)}
          {' '}km
        </Popup>
      </Marker>
    </>
  )
}