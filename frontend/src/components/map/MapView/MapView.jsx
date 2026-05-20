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

const MapInteractions = () => {

  useMapInteractions()

  return null
}

const MapView = () => {

  const { state } = useLayers()

  const visibleLayers =
    flattenLayers(state.layers)

  return (

    <MapContainer
      center={[-17.7833, -63.1821]}
      zoom={6}
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

      <FeaturePopup />

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