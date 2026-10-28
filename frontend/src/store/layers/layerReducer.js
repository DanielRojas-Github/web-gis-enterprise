import { LAYER_ACTIONS }
  from './layerActions'

import { updateLayerTree }
  from '@/gis/utils/updateLayerTree'

import {
  removeNodeFromTree,
} from '@/gis/utils/removeNodeFromTree'

import {
  insertNodeIntoGroup,
} from '@/gis/utils/insertNodeIntoGroup'

import {
  recalculateZIndex,
}
  from '@/gis/utils/recalculateZIndex'


export const layerReducer = (
  state,
  action
) => {

  switch (action.type) {

    case LAYER_ACTIONS.SET_LAYERS:
      return {
        ...state,

        layers:
          action.payload,
      }

    case LAYER_ACTIONS.ADD_LAYER:
      return {
        ...state,

        layers: [
          ...state.layers,
          action.payload,
        ],
      }

    case LAYER_ACTIONS.REMOVE_LAYER: {

      const {
        tree,
        removedNode,
      } =
        removeNodeFromTree(
          state.layers,
          action.payload
        )

      if (!removedNode) {
        return state
      }

      return {
        ...state,

        layers:
          tree,
      }
    }

    case LAYER_ACTIONS.TOGGLE_LAYER:
      return {
        ...state,

        layers:
          updateLayerTree(
            state.layers,

            action.payload,

            (layer) => ({
              ...layer,

              visible:
                !layer.visible,
            })
          ),
      }

    case LAYER_ACTIONS.SET_LAYER_OPACITY:
      return {
        ...state,

        layers:
          updateLayerTree(
            state.layers,

            action.payload.id,

            (layer) => ({
              ...layer,

              opacity:
                action.payload
                  .opacity,
            })
          ),
      }
    case LAYER_ACTIONS.TOGGLE_GROUP:
      return {
        ...state,

        layers:
          updateLayerTree(
            state.layers,

            action.payload,

            (group) => ({
              ...group,

              visible:
                !group.visible,
            })
          ),
      }
    case LAYER_ACTIONS.SET_ACTIVE_LAYER:
      return {
        ...state,

        activeLayer:
          action.payload,
      }
    case LAYER_ACTIONS.SET_LOADING_LAYERS:
      return {
        ...state,

        loadingLayers:
          action.payload,
      }
    case
      LAYER_ACTIONS
        .TOGGLE_GROUP_EXPANDED:

      return {
        ...state,

        layers:
          updateLayerTree(
            state.layers,

            action.payload,

            (group) => ({
              ...group,

              expanded:
                !group.expanded,
            })
          ),
      }
    case LAYER_ACTIONS.MOVE_NODE: {

      const {
        nodeId,
        targetGroupId,
      } = action.payload

      const {
        tree,
        removedNode,
      } =
        removeNodeFromTree(
          state.layers,

          nodeId
        )

      if (!removedNode) {
        return state
      }

      const updatedTree =
        insertNodeIntoGroup(
          tree,

          targetGroupId,

          removedNode
        )

      return {
        ...state,

        layers:
          recalculateZIndex(
            updatedTree
          ),
      }
    }
    case LAYER_ACTIONS.UPDATE_LAYER:
      return {
        ...state,

        layers:
          updateLayerTree(
            state.layers,

            action.payload.id,

            (layer) => ({
              ...layer,

              ...action.payload.updates,
            })
          ),
      }
    case LAYER_ACTIONS.ADD_LAYER_TO_GROUP:
      return {
        ...state,

        layers:
          insertNodeIntoGroup(
            state.layers,

            action.payload.groupId,

            action.payload.layer
          ),
      }
    case LAYER_ACTIONS.UPDATE_FEATURE_IN_LAYER:

      return {
        ...state,

        layers: updateLayerTree(
          state.layers,
          action.payload.layerId,
          (layer) => {

            const updatedFeatures =
              layer.source.features.features.map(
                feature => {
                  return feature.id === action.payload.feature.id
                    ? action.payload.feature
                    : feature

                }

              )


            return {
              ...layer,

              dirty: true,

              source: {
                ...layer.source,

                features: {
                  ...layer.source.features,

                  features: updatedFeatures,
                },
              },
            }
          }
        ),
      }
    case LAYER_ACTIONS.MARK_LAYER_DIRTY:
      return {
        ...state,
        layers: updateLayerTree(
          state.layers,
          action.payload,
          layer => {
            return {
              ...layer,
              dirty: true,
            }

          }
        ),
      }
    case LAYER_ACTIONS.SET_LAYER_SYNC_ERROR:
      return {
        ...state,

        layers:
          updateLayerTree(
            state.layers,

            action.payload.layerId,

            (layer) => ({
              ...layer,

              saving: false,

              syncError:
                action.payload.error,
            })
          ),
      }
    case LAYER_ACTIONS.CLEAR_LAYER_DIRTY:
      return {
        ...state,
        layers: updateLayerTree(
          state.layers,
          action.payload,
          layer => ({
            ...layer,
            dirty: false,
            saving: false,
          })
        ),
      }

    case LAYER_ACTIONS.LAYER_PERSISTENCE_SUCCESS:
      return {
        ...state,
        layers: updateLayerTree(
          state.layers,
          action.payload,
          layer => ({
            ...layer,
            dirty: false,
            saving: false,
            lastSaved: Date.now(),
            syncError: null,
          })
        ),
      }
    case LAYER_ACTIONS.SAVE_LAYER:

      return {
        ...state,

        layers:
          updateLayerTree(
            state.layers,

            action.payload,

            (layer) => ({
              ...layer,

              dirty:
                false,

              saving:
                false,

              lastSaved:
                Date.now(),

              syncError:
                null,
            })
          ),
      }
    case LAYER_ACTIONS.SET_LAYER_SAVING:
      return {
        ...state,

        layers:
          updateLayerTree(
            state.layers,

            action.payload.layerId,

            (layer) => ({
              ...layer,

              saving:
                action.payload.saving,

              syncError:
                action.payload.saving
                  ? null
                  : layer.syncError,
            })
          ),
      }

    default:
      return state
  }
}