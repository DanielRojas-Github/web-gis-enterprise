import { useGIS } from '@/store/gis/hooks/useGIS'

import { GIS_ACTIONS } from '@/store/gis/gisActions'

import { selectFeature } from '../services/selectionService'

export const useFeatureSelection =
  () => {
    const { dispatch } = useGIS()

    const handleFeatureSelection =
      async ({
        layer,
        params,
      }) => {
        try {
          dispatch({
            type: GIS_ACTIONS.SET_LOADING,

            payload: true,
          })

          const feature =
            await selectFeature({
              layer,
              params,
            })

          dispatch({
            type:
              GIS_ACTIONS.SET_SELECTED_FEATURE,

            payload: feature,
          })
        } catch (error) {
          dispatch({
            type: GIS_ACTIONS.SET_ERROR,

            payload: error.message,
          })
        } finally {
          dispatch({
            type: GIS_ACTIONS.SET_LOADING,

            payload: false,
          })
        }
      }

    return {
      handleFeatureSelection,
    }
  }