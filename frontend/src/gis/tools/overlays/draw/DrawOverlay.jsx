import {
  Marker,
  Polyline,
} from 'react-leaflet'

import {
  useEffect,
  useState,
} from 'react'

import { drawState }
from './drawStore'

import { Polygon }
from 'react-leaflet'

import { DRAW_TYPES }
from '@/gis/tools/tools/draw/drawTypes'

import {
  useLocalFeatureSelection
}
from '@/gis/selection/hooks/useLocalFeatureSelection'

import { useGIS }
from '@/store/gis/hooks/useGIS'

import { GIS_ACTIONS }
from '@/store/gis/gisActions'

// import { useMap } from 'react-leaflet'




export default function DrawOverlay() {
// const map = useMap()

// useEffect(() => {
  


//   if (drawState.features.length > 0) {

//     map.fitBounds(
//       drawState.features[0].points
//     )

   
//   }

// }, [map])
  const [, forceUpdate] =
    useState(0)

  const {
  selectedFeature,
  selectFeature,
}
=
useLocalFeatureSelection()

const { state, dispatch } =
  useGIS()

  useEffect(() => {

 
    return drawState.subscribe(
      
      () => {
    
 
        forceUpdate(
          v => v + 1
        )
 
      }
      
    )
  
  }, [])

  const isSelected =
  feature =>
    selectedFeature?.id ===
    feature.id
  
  const handleAddVertex = (
  feature,
  latlng
) => {

  if (
    state.editingFeature?.id !==
    feature.id
  ) {
    return
  }

  const updatedFeature = {

    ...feature,

    points: [

      ...feature.points,

      latlng,
    ],
  }

  drawState.updateFeature(
    updatedFeature
  )

  dispatch({

    type:
      GIS_ACTIONS
        .SET_EDITING_FEATURE,

    payload:
      updatedFeature,
  })

  dispatch({

    type:
      GIS_ACTIONS
        .SET_SELECTED_FEATURE,

    payload:
      updatedFeature,
  })
}

  return (
  <>
    {drawState.features.map(
  feature => {


    if (
  feature.type ===
  DRAW_TYPES.POINT
) {





  return (

    <Marker
      key={feature.id}
      position={
        feature.points[0]
      }
    />

  )
}

    if (
      feature.type ===
      DRAW_TYPES.POLYLINE
    ) {


      return (
        <Polyline
  key={feature.id}
  positions={feature.points}
  pathOptions={{
    color:
      isSelected(feature)
        ? '#ff5500'
        : 'green',

    weight:
      isSelected(feature)
        ? 6
        : 4,
  }}
eventHandlers={{

  click: () => selectFeature(feature),

  dblclick: event => {

    handleAddVertex(
      feature,
      event.latlng
    )
  },
}}
/>
      )
    }

    if (
      feature.type ===
      DRAW_TYPES.POLYGON
    ) {
      return (
     <Polygon
  key={feature.id}
  positions={feature.points}
  pathOptions={{
    color:
      isSelected(feature)
        ? '#ff5500'
        : '#3388ff',

    weight:
      isSelected(feature)
        ? 5
        : 3,
  }}
 eventHandlers={{
  click: () => selectFeature(feature),
  dblclick: event => {

    handleAddVertex(
      feature,
      event.latlng
    )
  },
}}
/> 
      )
    }


    return null
  }
)}
{drawState.features.map(
  feature => {

 

   
    if (
      feature.type ===
      DRAW_TYPES.POINT
    ) {


      return (
        <Marker
          key={feature.id}
          position={
            feature.points[0]
          }
        />
      )
    }

    if (
      feature.type ===
      DRAW_TYPES.POLYLINE
    ) {

    
      

      return (

        <Polyline
          key={`${feature.id}-${feature.points.length}`}
          positions={
            feature.points
          }


          pathOptions={{
            color: 'red',
            weight: 8,
          }}
          eventHandlers={{
            click: () =>
              selectFeature(
                feature
              ),

            dblclick:
              event => {

              handleAddVertex(
                feature,
                event.latlng
              )
            },
          }}
        />

      )
    }

    if (
      feature.type ===
      DRAW_TYPES.POLYGON
    ) {


      return (

        <Polygon
          key={feature.id}
          positions={
            feature.points
          }
          pathOptions={{
            color:
              isSelected(feature)
                ? '#ff5500'
                : '#3388ff',

            weight:
              isSelected(feature)
                ? 5
                : 3,
          }}
        />

      )
    }

   

    return null
  }
)}
    {drawState.type ===
      DRAW_TYPES.POINT &&

      drawState.points.map(
        (point, index) => (
          <Marker
            key={index}
            position={point}
          />
        )
      )
    }

    {drawState.type ===
      DRAW_TYPES.POLYLINE && (
        <>
          {drawState.points.map(
            (point, index) => (
              <Marker
                key={index}
                position={point}
              />
            )
          )}

          {drawState.points.length >= 2 && (
            <Polyline
              positions={
                drawState.points
              }
              pathOptions={{
                color: 'blue',
                weight: 4,
              }}
            />
          )}
        </>
      )
    }

    {drawState.type ===
      DRAW_TYPES.POLYGON && (

        <>

          {drawState.points.map(
            (point, index) => (
              <Marker
                key={index}
                position={point}
              />
            )
          )}

          {drawState.points.length >= 3 && (

            <Polygon
              positions={
                drawState.points
              }
            />

          )}

        </>

      )}

  </>
)
}
