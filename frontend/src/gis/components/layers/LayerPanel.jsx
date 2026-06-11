import { useLayers }
  from '@/store/layers/hooks/useLayers'


//import DraggableLayerItem from './DraggableLayerItem'

import LayerGroup
  from '@/gis/components/layers/groups/LayerGroup'

import {
  LAYER_TYPES,
} from '@/gis/layers/registry/layerSchema'

import LayerItem
  from './LayerItem'

const LayerPanel = () => {
  const { layers } = useLayers()

  return (
    // console.log('Rendering LayerPanel with layers:', layers) ||
    <div className="layer-panel">
      <h3>Layers</h3>
    {layers.map((layer) => {

  console.log(
    'Rendering layer:',
    layer.id,
    layer.type
  )

  if (
    layer.type ===
    LAYER_TYPES.GROUP
  ) {
    return (
      <LayerGroup
        key={layer.id}
        group={layer}
      />
    )
  }

  return (
    <LayerItem
      key={layer.id}
      layer={layer}
    />
  )
})}
 
    </div>
  )
}

export default LayerPanel