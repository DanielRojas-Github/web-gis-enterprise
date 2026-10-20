
import { useEffect, useState } from 'react'
import { Marker, Polygon, Polyline } from 'react-leaflet'

import { drawState } from './drawStore'
import { DRAW_TYPES } from '@/gis/tools/tools/draw/drawTypes'
import { useLocalFeatureSelection } from '@/gis/selection/hooks/useLocalFeatureSelection'
import { useGIS } from '@/store/gis/hooks/useGIS'
import { GIS_ACTIONS } from '@/store/gis/gisActions'

export default function DrawOverlay() {
  const [, forceUpdate] = useState(0)

  const { selectedFeature, selectFeature } =
    useLocalFeatureSelection()

  const { state, dispatch } = useGIS()

  useEffect(() => {
    return drawState.subscribe(() => {
      forceUpdate((value) => value + 1)
    })
  }, [])

  const isSelected = (feature) =>
    selectedFeature?.id === feature.id

  const handleAddVertex = (feature, latlng) => {
    if (state.editingFeature?.id !== feature.id) {
      return
    }

    const updatedFeature = {
      ...feature,
      points: [...feature.points, latlng],
    }

    drawState.updateFeature(updatedFeature)

    dispatch({
      type: GIS_ACTIONS.SET_EDITING_FEATURE,
      payload: updatedFeature,
    })

    dispatch({
      type: GIS_ACTIONS.SET_SELECTED_FEATURE,
      payload: updatedFeature,
    })
  }

  const handleFeatureDoubleClick = (event, feature) => {
    // Evita que el doble clic sobre una geometría existente
    // llegue al manejador de doble clic del mapa.
    event.originalEvent?.stopPropagation()

    handleAddVertex(feature, event.latlng)
  }

  return (
    <>
      {/* Geometrías guardadas: cada entidad se renderiza una sola vez. */}
      {drawState.features.map((feature) => {
        if (!feature.points?.length) {
          return null
        }

        if (feature.type === DRAW_TYPES.POINT) {
          return (
            <Marker
              key={feature.id}
              position={feature.points[0]}
              eventHandlers={{
                click: () => selectFeature(feature),
              }}
            />
          )
        }

        if (feature.type === DRAW_TYPES.POLYLINE) {
          if (feature.points.length < 2) {
            return null
          }

          return (
            <Polyline
              key={feature.id}
              positions={feature.points}
              pathOptions={{
                color: isSelected(feature) ? '#ff5500' : 'green',
                weight: isSelected(feature) ? 6 : 4,
              }}
              eventHandlers={{
                click: () => selectFeature(feature),
                dblclick: (event) =>
                  handleFeatureDoubleClick(event, feature),
              }}
            />
          )
        }

        if (feature.type === DRAW_TYPES.POLYGON) {
          if (feature.points.length < 3) {
            return null
          }

          return (
            <Polygon
              key={feature.id}
              positions={feature.points}
              pathOptions={{
                color: isSelected(feature) ? '#ff5500' : '#3388ff',
                weight: isSelected(feature) ? 5 : 3,
              }}
              eventHandlers={{
                click: () => selectFeature(feature),
                dblclick: (event) =>
                  handleFeatureDoubleClick(event, feature),
              }}
            />
          )
        }

        return null
      })}

      {/* Dibujo provisional de un punto. */}
      {drawState.type === DRAW_TYPES.POINT &&
        drawState.points.map((point, index) => (
          <Marker key={index} position={point} />
        ))}

      {/* Dibujo provisional de una línea. */}
      {drawState.type === DRAW_TYPES.POLYLINE && (
        <>
          {drawState.points.map((point, index) => (
            <Marker key={index} position={point} />
          ))}

          {drawState.points.length >= 2 && (
            <Polyline
              positions={drawState.points}
              pathOptions={{
                color: 'blue',
                weight: 4,
              }}
            />
          )}
        </>
      )}

      {/* Dibujo provisional de un polígono. */}
      {drawState.type === DRAW_TYPES.POLYGON && (
        <>
          {drawState.points.map((point, index) => (
            <Marker key={index} position={point} />
          ))}

          {drawState.points.length >= 3 && (
            <Polygon
              positions={drawState.points}
              pathOptions={{
                color: 'blue',
                weight: 3,
              }}
            />
          )}
        </>
      )}
    </>
  )
}
