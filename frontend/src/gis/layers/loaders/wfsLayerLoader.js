import {
  loadWFSFeatures,
}
from '@/gis/services/wfs/wfsService'

import {
  createVectorLayer,
}
from '../factories/vectorLayerFactory'

import {
  SOURCE_TYPES,
}
from '../registry/sourceTypes'

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

      source: {
        ...source,
        type:
          SOURCE_TYPES.WFS,
      },

      visible,

      opacity,

      zIndex,

      metadata,
    })
  }