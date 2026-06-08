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
} from '@/store/gis/hooks/useGIS'

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

// import MapClickMarker
//   from '@/gis/interactions/renderers/MapClickMarker'

// import MeasurementRenderer
// from '@/gis/measurements/renderers/MeasurementRenderer'

// import {
//   TOOL_TYPES,
// } from '@/gis/tools/toolTypes'

import MapEventHandler
  from '@/gis/interactions/events/MapEventHandler'

import MeasureOverlay
  from '@/gis/tools/overlays/measure/MeasureOverlay'

import DrawOverlay
  from '@/gis/tools/overlays/draw/DrawOverlay'

import EditVerticesOverlay
from '@/gis/tools/overlays/draw/EditVerticesOverlay'

import EditHistoryControls
from '@/gis/editing/components/EditHistoryControls'

import GeoJSONImportControl
from '@/gis/editing/components/GeoJSONImportControl'

import WFSLoadButton
from '@/gis/import/components/WFSLoadButton'

import { useEffect }
from 'react'

import {
  initializeFeaturePersistence,
}
from '@/gis/services/persistence/initializeFeaturePersistence'


const MapInteractions = () => {

  useMapInteractions()

  useMapZoom()

  return null
}

const MapView = () => {

    console.log(
    'MAPVIEW RENDERIZADO'
  )
  const {
    state:
    layerState,
  } = useLayers()

  const {
    state:
    gisState,
  } = useGIS()

   useEffect(() => {
      console.log(
    'EJECUTANDO PERSISTENCIA'
  )

    initializeFeaturePersistence()

  }, [])

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

    <>

      <MapContainer
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

        <MapInteractions />

        <MapEventHandler />

        <MeasureOverlay />

        <DrawOverlay />

        <EditVerticesOverlay />

        {/* <MapClickHandler /> 
      <MapClickMarker /> 
      <FeaturePopup /> */}




        {/* <MeasurementRenderer /> */}
        {visibleLayers.map((layer) => (
          <LayerRenderer
            key={layer.id}
            layer={layer}
          />
        ))}
      </MapContainer>

      <SelectionRenderer
        feature={gisState.selectedFeature} 
      />
      <EditHistoryControls />
      <GeoJSONImportControl />
      <WFSLoadButton />
      
    </>
  )
}

export default MapView