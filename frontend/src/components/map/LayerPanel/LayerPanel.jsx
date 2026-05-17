import { GIS_LAYERS } from '@constants/layers'

function LayerPanel() {
  return (
    <div className="layer-panel">
      <h3>Layers</h3>

      <ul>
        {GIS_LAYERS.map((layer) => (
          <li key={layer.id}>
            <label>
              <input
                type="checkbox"
                defaultChecked={layer.visible}
              />

              {layer.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LayerPanel