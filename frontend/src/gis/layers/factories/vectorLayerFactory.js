import {
  createLayer,
  LAYER_TYPES,
} from '../registry/layerSchema'

export const createVectorLayer = ({
  id,
  name,
  geojson,
}) => {

  return createLayer({

    id,

    name,

    type:
      LAYER_TYPES.VECTOR,

    visible: true,

    opacity: 1,

    zIndex: 1000,

    source: {
      features: geojson,
    },
  })
}