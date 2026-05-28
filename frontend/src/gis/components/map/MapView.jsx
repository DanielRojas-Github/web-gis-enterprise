import {
  MapContainer,
  TileLayer,
} from 'react-leaflet'

import { useLayers }
  from '@/store/layers/hooks/useLayers'

import LayerRenderer
  from '@/gis/layers/renderers/LayerRenderer'

import { useMapInteractions }
  from '@/gis/interactions/hooks/useMapInteractions'

// import FeaturePopup
// from '@/gis/popups/FeaturePopup'

import { flattenLayers }
  from '@/gis/utils/flattenLayers'

import {
  useMapZoom,
} from '@/gis/interactions/hooks/useMapZoom'

import {
  isLayerInScale,
} from '@/gis/utils/isLayerInScale'

import {
  useGIS
} from '@/store/gis/hooks/useGIS' //frontend/src/hooks/useGis.js

import {
  canUserAccessLayer,
} from '@/gis/utils/canUserAccessLayer'

import {
  layerMatchesFilters,
} from '@/gis/utils/layerMatchesFilters'

import SelectionRenderer
  from '@/gis/selection/renderers/SelectionRenderer'

//import MapClickHandler
 //from '@/gis/interactions/components/MapClickHandler'

import MapClickMarker
  from '@/gis/interactions/renderers/MapClickMarker'

import MeasurementRenderer
  from '@/gis/measurements/renderers/MeasurementRenderer'

import {
  TOOL_TYPES,
} from '@/gis/tools/toolTypes'

import MapEventHandler
  from '@/gis/interactions/events/MapEventHandler'

import  MeasureOverlay
  from '@/gis/tools/overlays/measure/MeasureOverlay' //frontend\src\gis\tools\overlays\measure\MeasureOverlay.jsx


const MapInteractions = () => {

  useMapInteractions()

  useMapZoom()

  return null
}

const MapView = () => {

  const {
    state:
    layerState,
  } = useLayers()

  const {
    state:
    gisState,
  } = useGIS()

  const visibleLayers =
    flattenLayers(
      layerState.layers
    ).filter(
      (layer) => {

        const inScale =
          isLayerInScale(
            layer,

            gisState.zoom
          )

        const hasAccess =
          canUserAccessLayer(
            layer,

            gisState.user.role
          )

        const matchesFilters =
          layerMatchesFilters(
            layer,

            gisState.filters
          )


        return (
          inScale &&
          hasAccess &&
          matchesFilters
        )
      }
    )

  return (

    <MapContainer
      // center={[-17.7833, -63.1821]}
      // zoom={6}
      center={[-21.5355, -64.7296]}
      zoom={13}
      style={{
        height: '100vh',
        width: '100%',
      }}
    >

      {/* Capa base del mapa */}
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      <MapInteractions /> // Maneja interacciones globales del mapa como clics, zoom, etc.

      <MapEventHandler /> // Maneja eventos específicos del mapa y delega a la herramienta activa

      {/* <MapClickHandler /> // Maneja clics en el mapa para herramientas como identificación, medición, etc. */}

      <MapClickMarker /> // Renderiza un marcador temporal en la ubicación del clic para herramientas que lo requieran

      <MeasureOverlay /> // Renderiza la superposición de medición si hay puntos de medición activos
      {/* 
      <FeaturePopup /> */} // Renderiza un popup para mostrar información de la característica seleccionada
      {gisState.activeTool ===
        TOOL_TYPES.IDENTIFY && ( // Renderiza la selección solo si la herramienta activa es IDENTIFY

          <SelectionRenderer //
            feature={
              gisState.selectedFeature
            }
          />
        )}
      <MeasurementRenderer />
      {visibleLayers.map((layer) => (
        <LayerRenderer
          key={layer.id}
          layer={layer}
        />

      ))}

      <MapEventHandler />

    </MapContainer>
  )
}

export default MapView