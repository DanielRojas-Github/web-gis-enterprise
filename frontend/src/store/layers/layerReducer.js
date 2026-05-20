import { LAYER_ACTIONS } from './layerActions'

export const layerReducer = (state, action) => {
  switch (action.type) {
    case LAYER_ACTIONS.SET_LAYERS:
      return {
        ...state,
        layers: action.payload,
      }

    case LAYER_ACTIONS.ADD_LAYER:
      return {
        ...state,
        layers: [...state.layers, action.payload],
      }

    case LAYER_ACTIONS.REMOVE_LAYER:
      return {
        ...state,
        layers: state.layers.filter(
          (layer) => layer.id !== action.payload
        ),
      }

    case LAYER_ACTIONS.TOGGLE_LAYER:
      return {
        ...state,
        layers: state.layers.map((layer) =>
          layer.id === action.payload
            ? {
                ...layer,
                visible: !layer.visible,
              }
            : layer
        ),
      }

    case LAYER_ACTIONS.SET_ACTIVE_LAYER:
      return {
        ...state,
        activeLayer: action.payload,
      }

    case LAYER_ACTIONS.SET_LAYER_OPACITY:
      return {
        ...state,
        layers: state.layers.map((layer) =>
          layer.id === action.payload.id
            ? {
                ...layer,
                opacity: action.payload.opacity,
              }
            : layer
        ),
      }

    case LAYER_ACTIONS.SET_LOADING_LAYERS:
      return {
        ...state,
        loadingLayers: action.payload,
      }

    case LAYER_ACTIONS.SET_LAYER_ERROR:
      return {
        ...state,
        layerErrors: action.payload,
      }
    case LAYER_ACTIONS.UPDATE_OPACITY:
  return {
    ...state,

    layers: state.layers.map((layer) =>
      layer.id ===
      action.payload.layerId
        ? {
            ...layer,
            opacity:
              action.payload.opacity,
          }
        : layer
    ),
  }
    case LAYER_ACTIONS.MOVE_LAYER_UP: {
  const layers = [...state.layers]

  const index = layers.findIndex(
    (layer) =>
      layer.id === action.payload
  )

  if (index <= 0) return state

  ;[
    layers[index - 1],
    layers[index],
  ] = [
    layers[index],
    layers[index - 1],
  ]

  return {
    ...state,
    layers,
  }
}

case LAYER_ACTIONS.MOVE_LAYER_DOWN: {
  const layers = [...state.layers]

  const index = layers.findIndex(
    (layer) =>
      layer.id === action.payload
  )

  if (
    index === -1 ||
    index === layers.length - 1
  ) {
    return state
  }

  ;[
    layers[index + 1],
    layers[index],
  ] = [
    layers[index],
    layers[index + 1],
  ]

  return {
    ...state,
    layers,
  }
}

    default:
      return state
  }
}

