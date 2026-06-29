import { useGISContext }
from './useGISContext'

import {
  GIS_ACTIONS,
}
from '../gisActions'

export const useGIS = () => {

  const {
    state,
    dispatch,
  } = useGISContext()

  const setSelectedFeature =
    feature =>
      dispatch({
        type:
          GIS_ACTIONS
            .SET_SELECTED_FEATURE,

        payload:
          feature,
      })

  const setEditing =
    editing =>
      dispatch({
        type:
          GIS_ACTIONS
            .SET_EDITING,

        payload:
          editing,
      })

  const setEditingFeature =
    feature =>
      dispatch({
        type:
          GIS_ACTIONS
            .SET_EDITING_FEATURE,

        payload:
          feature,
      })

  return {

    state,

    dispatch,

    setSelectedFeature,

    setEditing,

    setEditingFeature,
  }
}