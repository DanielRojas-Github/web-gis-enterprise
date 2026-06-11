import { useLayerContext } from '@/store/layers/hooks/useLayerContext'
import {
  LAYER_ACTIONS,
} from '../layerActions'

export const useLayers = () => {
  const { state, dispatch } =
    useLayerContext()
  const toggleLayer = (
    layerId
  ) =>
    dispatch({
      type:
        LAYER_ACTIONS
          .TOGGLE_LAYER,

      payload: layerId,
    })

  const setOpacity = (
    layerId,
    opacity
  ) =>
    dispatch({
      type:
        LAYER_ACTIONS
          .SET_LAYER_OPACITY,

      payload: {
        id: layerId,

        opacity,
      },
    })

  const setActiveLayer = (
    layerId
  ) =>
    dispatch({
      type:
        LAYER_ACTIONS
          .SET_ACTIVE_LAYER,

      payload: layerId,
    })
  
    const toggleGroup = (
  groupId
) =>
  dispatch({
    type:
      LAYER_ACTIONS
        .TOGGLE_GROUP,

    payload:
      groupId,
  })

const toggleGroupExpanded = (
  groupId
) =>
  dispatch({
    type:
      LAYER_ACTIONS
        .TOGGLE_GROUP_EXPANDED,

    payload:
      groupId,
  })

const moveNode = ({
  nodeId,
  targetGroupId,
}) =>
  dispatch({
    type:
      LAYER_ACTIONS
        .MOVE_NODE,

    payload: {
      nodeId,
      targetGroupId,
    },
  })

const setLayers = (
  layers
) =>
  dispatch({
    type:
      LAYER_ACTIONS
        .SET_LAYERS,

    payload:
      layers,
  })
const addLayerToGroup = ({
  groupId,
  layer,
}) =>
  dispatch({
    type:
      LAYER_ACTIONS
        .ADD_LAYER_TO_GROUP,

    payload: {
      groupId,
      layer,
    },
  })
 return {

  layers:
    state.layers,

  activeLayer:
    state.activeLayer,

  loadingLayers:
    state.loadingLayers,

  toggleLayer,

  toggleGroup,

  toggleGroupExpanded,

  moveNode,

  setLayers,

  addLayerToGroup,

  setOpacity,

  setActiveLayer,

  dispatch,
}
}