import { LAYER_ACTIONS }
  from './layerActions'

import { updateLayerTree }
  from '@/gis/utils/updateLayerTree'

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

    default:
      return state
  }
}