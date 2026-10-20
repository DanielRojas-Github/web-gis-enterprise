import {
  createLayer,
  LAYER_TYPES,
} from '../registry/layerSchema'

export const createVectorLayer = ({
  id,
  name,
  geojson,
  source = {},
  visible = true,
  opacity = 1,
  zIndex = 1000,
  metadata = {},
}) => {

  return createLayer({

    id,

    name,

    type:
      LAYER_TYPES.VECTOR,

    visible,

    opacity,

    zIndex,

    metadata,

    source: {

      ...source,

      features:
        geojson,
    },
  })
}