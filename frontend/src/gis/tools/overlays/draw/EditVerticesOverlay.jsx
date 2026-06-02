import {
  CircleMarker,
} from 'react-leaflet'

import { useGIS }
from '@/store/gis/hooks/useGIS'

export default function
EditVerticesOverlay() {

  const { state } =
    useGIS()

  const feature =
    state.editingFeature

  if (!feature) {
    return null
  }

  return (
    <>
      {feature.points.map(
        (point, index) => (

          <CircleMarker
            key={index}

            center={point}

            radius={6}
          />
        )
      )}
    </>
  )
}