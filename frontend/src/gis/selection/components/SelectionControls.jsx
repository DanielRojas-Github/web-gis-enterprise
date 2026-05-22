import { useGIS }
  from '@/store/gis/hooks/useGIS'

import {
  GIS_ACTIONS,
} from '@/store/gis/gisActions'

import {
  mockSelectedFeature,
} from '@/gis/selection/mocks/mockSelectedFeature'

const SelectionControls = () => {

  const {
    dispatch,
  } = useGIS()

  const handleSelect =
    () => {

      dispatch({
        type:
          GIS_ACTIONS.SET_SELECTED_FEATURE,

        payload:
          mockSelectedFeature,
      })
    }

  const handleClear =
    () => {

      dispatch({
        type:
          GIS_ACTIONS.SET_SELECTED_FEATURE,

        payload: null,
      })
    }

  return (
    <div>

      <button
        onClick={
          handleSelect
        }
      >
        Select Feature
      </button>

      <button
        onClick={
          handleClear
        }
      >
        Clear Selection
      </button>

    </div>
  )
}

export default SelectionControls