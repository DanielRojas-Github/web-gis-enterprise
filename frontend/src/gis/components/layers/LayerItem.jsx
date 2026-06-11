import { useLayers }
  from '@/store/layers/hooks/useLayers'

// import { LAYER_ACTIONS }
  // from '@/store/layers/layerActions'

import OpacitySlider
  from './OpacitySlider'

import LayerLegend
  from './LayerLegend'

const LayerItem = ({
  layer,
}) => {

  const { toggleLayer, setLayerOpacity } = useLayers()

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(layer.id, opacity)
  }

  const handleToggleLayer = () => {
    toggleLayer(layer.id)
  }

  return (
    <div className="layer-item">

      <div className="layer-item-header">

        <input
          type="checkbox"
          checked={
            layer.visible
          }
          onChange={
            handleToggleLayer
          }
        />

        <span>
          {layer.name}
        </span>

      </div>

      <OpacitySlider
        opacity={
          layer.opacity
        }
        onChange={
          handleOpacityChange
        }
      />

      <LayerLegend
        legendUrl={
          layer.legendUrl
        }
      />

    </div>
  )
}

export default LayerItem