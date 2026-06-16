import {
  GeoJSON,
} from 'react-leaflet'

import {
  useGIS,
} from '@/store/gis/hooks/useGIS'

import {
  GIS_ACTIONS,
} from '@/store/gis/gisActions'

const VectorRenderer = ({
  layer
}) => {
  console.log(
  'VECTOR DATA:',
  JSON.stringify(
    layer.source.features,
    null,
    2
  )
)
const {
  dispatch,
} = useGIS()


  if (!layer.visible) {
    return null
  }
const handleFeatureClick =
  (feature) => {

    console.log(
      'FEATURE SELECTED:',
      feature
    )

    dispatch({

      type:
        GIS_ACTIONS
          .SET_SELECTED_FEATURE,

      payload:
        feature,
    })
  }
  return (

  <GeoJSON

    data={
      layer.source.features
    }

    onEachFeature={

      (
        feature,
        leafletLayer
      ) => {

        leafletLayer.on({

          click: () =>
            handleFeatureClick(
              feature
            ),
        })
      }
    }
  />
)
}

export default VectorRenderer