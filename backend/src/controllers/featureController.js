import {
  sampleGeoJSON,
}
from '../data/sampleGeoJSON.js'

export function
getFeatures(
  request,
  response
) {

  response.json(
    sampleGeoJSON
  )
}