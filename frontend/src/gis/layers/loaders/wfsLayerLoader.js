import {
  loadWFSFeatures,
}
from '@/gis/services/wfs/wfsService'

import {
  createVectorLayer,
}
from '../factories/vectorLayerFactory'

export const loadWFSLayer =
  async (layer) => {

    const {
      id,
      name,
      source,
      visible,
      opacity,
      zIndex,
      metadata,
    } = layer

    const geojson =
      await loadWFSFeatures({
        typeName:
          source.layerName,
      })

    return createVectorLayer({

      id,

      name,

      geojson,

      visible,

      opacity,

      zIndex,

      metadata,
    })
  }