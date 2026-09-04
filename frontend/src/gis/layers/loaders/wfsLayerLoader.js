import {
  loadWFSFeatures,
}
from '@/gis/services/wfs/wfsService'

import {
  createVectorLayer,
}
from '../factories/vectorLayerFactory'

export const loadWFSLayer =
  async ({
    layerName,
  }) => {

    const geojson =
      await loadWFSFeatures({
        typeName:
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