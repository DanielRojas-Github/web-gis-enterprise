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
  
const {
  dispatch,
} = useGIS()


  if (!layer.visible) {
    return null
  }
const handleFeatureClick =
  (feature) => {

   

    dispatch({

      type:
        GIS_ACTIONS
          .SET_SELECTED_FEATURE,

      payload: {

        ...feature,

        layerId:
          layer.id,

        layerName:
          layer.name,
      },
    })
  }
 const geojson =
  layer.source?.features

if (!geojson?.features) {
  return null
}

return (
  <GeoJSON data={geojson} onEachFeature={

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
    } />
)
  

}

export default VectorRenderer