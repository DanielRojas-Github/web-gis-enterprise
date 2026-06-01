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

import { Polygon }
from 'react-leaflet'

import { DRAW_TYPES }
from '@/gis/tools/tools/draw/drawTypes'

export default function DrawOverlay() {

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
    {drawState.features.map(
  (feature, index) => {

    if (
      feature.type ===
      DRAW_TYPES.POLYLINE
    ) {
      return (
        <Polyline
          key={`feature-${index}`}
          positions={
            feature.points
          }
          pathOptions={{
            color: 'green',
            weight: 4,
          }}
        />
      )
    }

    if (
      feature.type ===
      DRAW_TYPES.POLYGON
    ) {
      return (
        <Polygon
          key={`feature-${index}`}
          positions={
            feature.points
          }
        />
      )
    }

    return null
  }
)}
    {drawState.type ===
      DRAW_TYPES.POINT &&

      drawState.points.map(
        (point, index) => (
          <Marker
            key={index}
            position={point}
          />
        )
      )
    }

    {drawState.type ===
      DRAW_TYPES.POLYLINE && (
        <>
          {drawState.points.map(
            (point, index) => (
              <Marker
                key={index}
                position={point}
              />
            )
          )}

          {drawState.points.length >= 2 && (
            <Polyline
              positions={
                drawState.points
              }
              pathOptions={{
                color: 'blue',
                weight: 4,
              }}
            />
          )}
        </>
      )
    }

    {drawState.type ===
      DRAW_TYPES.POLYGON && (

        <>

          {drawState.points.map(
            (point, index) => (
              <Marker
                key={index}
                position={point}
              />
            )
          )}

          {drawState.points.length >= 3 && (

            <Polygon
              positions={
                drawState.points
              }
            />

          )}

        </>

      )}

  </>
)
}
