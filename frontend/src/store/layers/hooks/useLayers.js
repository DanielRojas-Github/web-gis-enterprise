import { useLayerContext } from '@/store/layers/hooks/useLayerContext'
import {
  LAYER_ACTIONS,
} from '../layerActions'
import { useCallback } from 'react'


import {
  findLayerById,
} from '@/gis/utils/findLayerById'

import {
  loadWFSLayer,
} from '@/gis/layers/loaders/wfsLayerLoader'

import {
  SOURCE_TYPES,
}
  from '@/gis/layers/registry/sourceTypes'

const isUnloadedWFSLayer =
  layer =>
    layer?.source?.type ===
    SOURCE_TYPES.WFS &&
    !layer?.source?.features

export const useLayers = () => {
  const { state, dispatch } =
    useLayerContext()

  const loadWFSIntoStore =
    async (layer) => {

      try {

        dispatch({
          type:
            LAYER_ACTIONS.UPDATE_LAYER,

          payload: {
            id:
              layer.id,

            updates: {
              loading: true,
              error: null,
            },
          },
        })

        const loadedLayer =
          await loadWFSLayer(
            layer
          )

        dispatch({
          type:
            LAYER_ACTIONS.UPDATE_LAYER,

          payload: {
            id:
              layer.id,

            updates: {
              ...loadedLayer,

              visible: true,
              loading: false,
              error: null,
            },
          },
        })

        return true

      } catch (error) {

        console.error(
          'WFS layer loading failed:',
          layer.id,
          error
        )

        dispatch({
          type:
            LAYER_ACTIONS.UPDATE_LAYER,

          payload: {
            id:
              layer.id,

            updates: {
              loading: false,

              error:
                error.message ||
                'Failed to load WFS layer',
            },
          },
        })

        return false
      }
    }
  const toggleLayer =
    async (layerId) => {

      const layer =
        findLayerById(
          state.layers,
          layerId
        )

      if (!layer) {
        return
      }

      if (
        isUnloadedWFSLayer(layer) &&
        !layer.visible
      ) {

        await loadWFSIntoStore(
          layer
        )

        return
      }

      dispatch({
        type:
          LAYER_ACTIONS
            .TOGGLE_LAYER,

        payload:
          layerId,
      })
    }

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

  const toggleGroup =
    async (groupId) => {

      const group =
        findLayerById(
          state.layers,
          groupId
        )

      if (!group) {
        return
      }

      const newVisibility =
        !group.visible

      if (newVisibility) {

        for (
          const layer
          of group.children || []
        ) {

          if (
            layer.visible &&
            isUnloadedWFSLayer(layer)
          ) {

            await loadWFSIntoStore(
              layer
            )
          }
        }
      }

      dispatch({
        type:
          LAYER_ACTIONS
            .TOGGLE_GROUP,

        payload:
          groupId,
      })
    }

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



  const setLayerSyncError = useCallback(
  (
    layerId,
    error
  ) =>
    dispatch({
      type:
        LAYER_ACTIONS.SET_LAYER_SYNC_ERROR,

      payload: {
        layerId,
        error,
      },
    }),
  [dispatch]
)

const setLayerSaving = useCallback(
  (layerId, saving) =>
    dispatch({
      type:
        LAYER_ACTIONS.SET_LAYER_SAVING,
      payload: {
        layerId,
        saving,
      },
    }),
  [dispatch]
)

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

      console.error(
        'LAYER SAVE FAILED:',
        layerId,
        err
      )

      setLayerSyncError(
        layerId,
        err.message ||
        'Failed to save layer'
      )
    }
  },
  [
    dispatch,
    setLayerSaving,
    setLayerSyncError,
  ]
)
  const updateLayer = (
    layerId,
    updates
  ) =>
    dispatch({
      type:
        LAYER_ACTIONS
          .UPDATE_LAYER,

      payload: {
        id: layerId,

        updates,
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

    updateLayer,

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