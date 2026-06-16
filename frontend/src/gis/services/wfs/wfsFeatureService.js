
import {
  validateGeoJSON,
}
from '@/gis/import/validators/geojsonValidator'

export async function
loadWFSFeatures(
  url
) {

  const response =
    await fetch(url)

  if (!response.ok) {

    throw new Error(
      'Error consultando WFS'
    )
  }

  const geojson =
    await response.json()

  validateGeoJSON(
    geojson
  )

  return geojson
}