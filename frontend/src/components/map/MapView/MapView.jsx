import { MapContainer, TileLayer } from 'react-leaflet'

import LayerPanel from '@components/map/LayerPanel/LayerPanel'
import MapControls from '@components/map/MapControls/MapControls'

import { mapConfig, tileLayers } from '@services/map/map.service'

function MapView() {
  return (
    <div className="map-wrapper">
      <LayerPanel />

      <MapControls />

      <MapContainer
        center={mapConfig.center}
        zoom={mapConfig.zoom}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution={tileLayers.osm.attribution}
          url={tileLayers.osm.url}
        />
      </MapContainer>
    </div>
  )
}

export default MapView