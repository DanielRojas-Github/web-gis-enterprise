import { MapContainer, TileLayer } from 'react-leaflet'

function MapView() {
  return (
    <MapContainer
      center={[-21.5355, -64.7296]}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
    </MapContainer>
  )
}

export default MapView