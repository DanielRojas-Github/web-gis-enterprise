import {
  getWFSFeatures,
}
from '@/gis/services/geoserver/getWFSFeatures'

import {
  createVectorLayer,
}
from '../factories/vectorLayerFactory'

export const loadWFSLayer =
  async ({
    layerName,
  }) => {

    const geojson =
      await getWFSFeatures({
        layer:
          layerName,
      })

    return createVectorLayer({

      id:
        `wfs-${layerName}-${Date.now()}`,

      name:
        layerName,

      geojson,
    })
  }