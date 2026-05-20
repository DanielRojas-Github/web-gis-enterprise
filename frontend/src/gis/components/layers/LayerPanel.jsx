import { useLayerStore } from "../../store/layerStore"

import LayerGroup from "./LayerGroup"

const LayerPanel = () => {
  const {
    layers,
    toggleLayer,
    toggleGroup
  } = useLayerStore()

  return (
    <div className="layer-panel">
      <h2>Layers</h2>

      {layers.map((group) => (
        <LayerGroup
          key={group.id}
          group={group}
          toggleGroup={toggleGroup}
          toggleLayer={toggleLayer}
        />
      ))}
    </div>
  )
}

export default LayerPanel