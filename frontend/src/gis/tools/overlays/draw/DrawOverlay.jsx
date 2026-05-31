import {
  Marker,
  Polyline,
} from 'react-leaflet'

import {
  useEffect,
  useState,
} from 'react'

import { drawState }
from './drawStore'

console.log('DrawOverlay file loaded')

export default function DrawOverlay() {

  console.log('DrawOverlay component mounted')

  const [, forceUpdate] =
    useState(0)

  useEffect(() => {

    return drawState.subscribe(
      () => {

        forceUpdate(
          v => v + 1
        )
      }
    )

  }, [])

  return (
    <>
      <Marker
        position={[-21.5355, -64.7296]}
      />
    </>
  )
}