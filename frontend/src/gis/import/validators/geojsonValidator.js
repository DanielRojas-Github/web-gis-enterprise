const SUPPORTED_GEOMETRIES = [

  'Point',

  'LineString',

  'Polygon',
]

export function validateGeoJSON(
  geojson
) {

  if (!geojson) {

    throw new Error(
      'GeoJSON vacío'
    )
  }

  if (
    geojson.type !==
    'FeatureCollection'
  ) {

    throw new Error(
      'Debe ser un FeatureCollection'
    )
  }

  if (
    !Array.isArray(
      geojson.features
    )
  ) {

    throw new Error(
      'Features inválidas'
    )
  }

  geojson.features.forEach(
    feature => {

      if (
        !feature.geometry
      ) {

        throw new Error(
          'Feature sin geometría'
        )
      }

      if (

        !SUPPORTED_GEOMETRIES.includes(
          feature.geometry.type
        )

      ) {

        throw new Error(

          `Geometría no soportada: ${feature.geometry.type}`

        )
      }
    }
  )

  return true
}