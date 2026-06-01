import { useGIS }
from '@/store/gis/hooks/useGIS'

import { GIS_ACTIONS }
from '@/store/gis/gisActions'

export const useLocalFeatureSelection =
  () => {

    const {
      state,
      dispatch,
    } = useGIS()

    const selectFeature =
      feature => {

        dispatch({
          type:
            GIS_ACTIONS.SET_SELECTED_FEATURE,

          payload: feature,
        })
      }

    const clearSelection =
      () => {

        dispatch({
          type:
            GIS_ACTIONS.SET_SELECTED_FEATURE,

          payload: null,
        })
      }

    return {

      selectedFeature:
        state.selectedFeature,

      selectFeature,

      clearSelection,
    }
  }