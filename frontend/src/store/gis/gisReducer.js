import { GIS_ACTIONS } from './gisActions'

export const gisReducer = (state, action) => {
  switch (action.type) {
    case GIS_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }

    case GIS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      }

    case GIS_ACTIONS.SET_SELECTED_FEATURE:
      return {
        ...state,
        selectedFeature: action.payload,
      }

    case GIS_ACTIONS.SET_MAP_CENTER:
      return {
        ...state,
        mapCenter: action.payload,
      }

    case GIS_ACTIONS.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload,
      }

    case GIS_ACTIONS.SET_ACTIVE_TOOL:
      return {
        ...state,
        activeTool: action.payload,
      }

    case GIS_ACTIONS.SET_FEATURE_INFO:
      return {
        ...state,
        featureInfo: action.payload,
      }

    case GIS_ACTIONS.TOGGLE_DRAW_MODE:
      return {
        ...state,
        drawMode: !state.drawMode,
      }

    case GIS_ACTIONS.SET_VISIBLE_LAYERS:
      return {
        ...state,
        visibleLayers: action.payload,
      }
    case GIS_ACTIONS.SET_FILTERS:
  return {
    ...state,

    filters:
      action.payload,
  }
    default:
      return state
  }
}