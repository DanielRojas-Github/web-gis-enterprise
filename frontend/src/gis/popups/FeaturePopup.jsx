import {
  Popup,
  Marker,
} from 'react-leaflet'

import { useGIS } from '@/store/gis/hooks/useGIS'

const FeaturePopup = () => {
  const { state } = useGIS()

  const feature =
    state.selectedFeature

  if (!feature) return null

  return (
    <Marker position={feature.coordinates}>
      <Popup>
        <div>
          <h3>Selected Feature</h3>

          <p>
            Lat:
            {feature.coordinates.lat}
          </p>

          <p>
            Lng:
            {feature.coordinates.lng}
          </p>
        </div>
      </Popup>
    </Marker>
  )
}

export default FeaturePopup