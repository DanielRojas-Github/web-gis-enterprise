import {
  createLayer,
  LAYER_TYPES,
}
from './layerSchema'

export const baseLayers = [

  createLayer({

    id: 'osm',

    name: 'OpenStreetMap',

    type: LAYER_TYPES.TILE,

    visible: true,

    opacity: 1,

    zIndex: 1,

    source: {
      url:
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
  }),
]