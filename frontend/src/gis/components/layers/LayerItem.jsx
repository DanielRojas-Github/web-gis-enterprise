import { useLayers } from '@/store/layers/hooks/useLayers'

import { LAYER_ACTIONS } from '@/store/layers/layerActions'

import OpacitySlider from './OpacitySlider'

import LayerLegend from './LayerLegend'

import LayerOrderingControls from './LayerOrderingControls'

const LayerItem = ({ layer }) => {
  const { dispatch } = useLayers()

  const handleOpacityChange = (
    opacity
  ) => {
    dispatch({
      type: LAYER_ACTIONS.UPDATE_OPACITY,

      payload: {
        layerId: layer.id,
        opacity,
      },
    })
  }

const moveLayerUp = () => {
  dispatch({
    type:
      LAYER_ACTIONS.MOVE_LAYER_UP,

    payload: layer.id,
  })
}

const moveLayerDown = () => {
  dispatch({
    type:
      LAYER_ACTIONS.MOVE_LAYER_DOWN,

    payload: layer.id,
  })
}

  return (
    <div className="layer-item">
      <div className="layer-item-header">
        <input
          type="checkbox"
          checked={layer.visible}
          onChange={() =>
            dispatch({
              type:
                LAYER_ACTIONS.TOGGLE_LAYER,

              payload: layer.id,
            })
          }
        />

        <span>{layer.name}</span>
      </div>

      <LayerOrderingControls
        onMoveUp={moveLayerUp}
        onMoveDown={moveLayerDown}
      />
      <OpacitySlider
        opacity={layer.opacity}
        onChange={handleOpacityChange}
      />
      <LayerLegend
    legendUrl={layer.legendUrl}  />

    </div>
      
  )
}

export default LayerItem