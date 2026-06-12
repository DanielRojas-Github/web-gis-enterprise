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

    case LAYER_ACTIONS.REMOVE_LAYER:
      return {
        ...state,

        layers:
          state.layers.filter(
            (layer) =>
              layer.id !==
              action.payload
          ),
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
        console.log(
    'STATE BEFORE:',
    state.layers
  )

  console.log(
    'PAYLOAD:',
    action.payload
  )

      return {
        ...state,

        layers:
          state.layers.map(
            (group) => {
              if (
                group.id !==
                action.payload
              ) {
                return group
              }

              const newVisibility =
                !group.visible

              return {
                ...group,

                visible:
                  newVisibility,

                children:
                  group.children.map(
                    (layer) => ({
                      ...layer,

                      visible:
                        newVisibility,
                    })
                  ),
              }
            }
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

    case LAYER_ACTIONS.SET_LAYER_ERROR:
      return {
        ...state,

        layerErrors:
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
  
    layers: state.layers.map(
      (group) => {
console.log(
  'ADD_LAYER_TO_GROUP',
  action.payload
)
        if (
          group.id !==
          action.payload.groupId
        ) {

          return group
        }
          console.log(
  'Group found:',
  group.id
)
        return {
          
          ...group,

          children: [
            ...group.children,
            action.payload.layer,
          ],
        }
      }
    ),
  }
    default:
      return state
  }
}