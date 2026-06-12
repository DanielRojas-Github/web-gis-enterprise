
import {
  validateGeoJSON,
}
from '../validators/geojsonValidator'


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

  return geojson
}

export function
importGeoJSONResponse(
  geojson
) {

  validateGeoJSON(
    geojson
  )

  return geojson
}