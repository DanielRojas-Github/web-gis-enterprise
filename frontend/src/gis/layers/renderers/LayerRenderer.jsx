import TileRenderer
  from './TileRenderer'

import WMSRenderer
  from './WMSRenderer'

import VectorRenderer
  from './VectorRenderer'

import {
  LAYER_TYPES,
} from '../registry/layerSchema'

const LayerRenderer = ({
  layer
}) => {
  console.log(
  'LayerRenderer:',
  layer.name,
  layer.type
)

  switch (layer.type) {

    case LAYER_TYPES.TILE:
      return (
        <TileRenderer
          layer={layer}
        />
      )

    case LAYER_TYPES.WMS:
      return (
        <WMSRenderer
          layer={layer}
        />
      )

    case LAYER_TYPES.VECTOR:
        console.log(
    'VECTOR DETECTED',
    layer
  )
      return (
        <VectorRenderer
          layer={layer}
        />
      )

    default:
      return null
  }
}

export default LayerRenderer