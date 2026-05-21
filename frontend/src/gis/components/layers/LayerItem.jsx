import { useLayers }
  from '@/store/layers/hooks/useLayers'

import { LAYER_ACTIONS }
  from '@/store/layers/layerActions'

import OpacitySlider
  from './OpacitySlider'

import LayerLegend
  from './LayerLegend'

const LayerItem = ({
  layer,
}) => {

  const { dispatch } =
    useLayers()

  const handleOpacityChange =
    (opacity) => {

      dispatch({
        type:
          LAYER_ACTIONS.SET_LAYER_OPACITY,

        payload: {
          id: layer.id,

          opacity,
        },
      })
    }

  const handleToggleLayer =
    () => {

      dispatch({
        type:
          LAYER_ACTIONS.TOGGLE_LAYER,

        payload:
          layer.id,
      })
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