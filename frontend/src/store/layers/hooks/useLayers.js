import { useLayerContext } from '@/store/layers/hooks/useLayerContext'
import {
  LAYER_ACTIONS,
} from '../layerActions'
import { useCallback } from 'react'



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

  const updateFeatureInLayer =
    ({
      layerId,
      feature,
    }) => {

      console.log(
        'UPDATE FEATURE HOOK',
        layerId,
        feature
      )

      dispatch({

        type:
          LAYER_ACTIONS
            .UPDATE_FEATURE_IN_LAYER,

        payload: {
          layerId,
          feature,
        },
      })

    }
  const markLayerDirty =
    layerId => {
      dispatch({
        type:
          LAYER_ACTIONS
            .MARK_LAYER_DIRTY,

        payload:
          layerId,
      })

    }
  const clearLayerDirty =
    layerId =>
      dispatch({
        type:
          LAYER_ACTIONS
            .CLEAR_LAYER_DIRTY,

        payload:
          layerId,
      })

  const setLayerSyncError =
  (
    layerId,
    error
  ) =>
    dispatch({
      type:
        LAYER_ACTIONS
          .SET_LAYER_SYNC_ERROR,

      payload: {
        layerId,
        error,
      },
    })

  const setLayerSaving = (layerId, saving) =>
    dispatch({
      type: LAYER_ACTIONS.SET_LAYER_SAVING,
      payload: { layerId, saving },
    })

  const saveLayer = useCallback(
    async (layerId) => {
      setLayerSaving(layerId, true)

      try {
        await new Promise(
          res => setTimeout(res, 600)
        )

        dispatch({
          type:
            LAYER_ACTIONS.SAVE_LAYER,
          payload:
            layerId,
        })

        console.log(
          'LAYER SAVED:',
          layerId
        )
      } catch (err) {
        console.error(err)

        dispatch({
          type:
            LAYER_ACTIONS.SET_LAYER_ERROR,
          payload: {
            layerId,
            error: err.message,
          },
        })
      }
    },
    [dispatch]
  )

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

    updateFeatureInLayer,

    setOpacity,

    setActiveLayer,

    dispatch,

    markLayerDirty,

    clearLayerDirty,

    setLayerSyncError,

    setLayerSaving,

    saveLayer,
  }
}