import {
  Marker,
  Popup,
} from 'react-leaflet'

import { useGIS }
  from '@/store/gis/hooks/useGIS'

const MapClickMarker = () => {

  const {
    state,
  } = useGIS()

  const featureInfo =
    state.featureInfo

  if (!featureInfo) {
    return null
  }

  return (
    <Marker
      position={[
        featureInfo.lat,
        featureInfo.lng,
      ]}
    >
      <Popup>
        <div>

          <h3>
            Map Click
          </h3>

          <p>
            Lat:
            {' '}
            {featureInfo.lat}
          </p>

          <p>
            Lng:
            {' '}
            {featureInfo.lng}
          </p>

        </div>
      </Popup>
    </Marker>
  )
}

export default MapClickMarker