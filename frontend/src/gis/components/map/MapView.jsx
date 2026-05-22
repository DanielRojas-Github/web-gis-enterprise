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

import FeaturePopup
  from '@/gis/popups/FeaturePopup'

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

      <MapInteractions />
{/* 
      <FeaturePopup /> */}
      <SelectionRenderer
  feature={
    gisState.selectedFeature
  }
/>
      {visibleLayers.map((layer) => (
        <LayerRenderer
          key={layer.id}
          layer={layer}
        />
        
      ))}
      
    </MapContainer>
  )
}

export default MapView