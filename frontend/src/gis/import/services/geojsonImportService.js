import { drawState }
from '@/gis/tools/overlays/draw/drawStore'

import {
  validateGeoJSON,
}
from '../validators/geojsonValidator'

import {
  geoJSONCollectionToFeatures
}
from '@/gis/tools/overlays/draw/importGeoJSON'

export async function
importGeoJSONFile(
  file
) {

  const text =
    await file.text()

  const geojson =
    JSON.parse(text)

  validateGeoJSON(
    geojson
  )

  const importedFeatures =

    geoJSONCollectionToFeatures(
      geojson
    )

  drawState.setFeatures([

    ...drawState.features,

    ...importedFeatures,

  ])

  return importedFeatures
}

export function
importGeoJSONResponse(
  geojson
) {

    
  validateGeoJSON(
    geojson
  )

  const importedFeatures =

    geoJSONCollectionToFeatures(
      geojson
    )

  drawState.setFeatures([

    ...drawState.features,

    ...importedFeatures,

  ])
  console.log(
  drawState.features
)

  return importedFeatures
}