import { layerFactory } from './factories/layerFactory'

const LayerRenderer = ({ layer }) => {
  return (layerFactory(layer))
}

export default LayerRenderer