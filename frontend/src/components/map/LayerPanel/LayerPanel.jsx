import { useLayers }
  from '@/store/layers/hooks/useLayers'

import LayerItem from '@/gis/components/layers/LayerItem'

const LayerPanel = () => {
  const { state } = useLayers()

  return (
    <div className="layer-panel">
      <h3>Layers</h3>

      {state.layers.map((layer) => (
        <LayerItem
          key={layer.id}
          layer={layer}
        />
      ))}
    </div>
  )
}

export default LayerPanel