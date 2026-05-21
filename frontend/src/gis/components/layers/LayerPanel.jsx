import { useLayers }
  from '@/store/layers/hooks/useLayers'


//import DraggableLayerItem from './DraggableLayerItem'

import LayerGroup
  from '@/gis/components/layers/groups/LayerGroup'

const LayerPanel = () => {
  const { state } = useLayers()

  return (
    <div className="layer-panel">
      <h3>Layers</h3>

      {state.layers.map((group) => (
  <LayerGroup
    key={group.id}
    group={group}
  />
))}
      
    </div>
  )
}

export default LayerPanel