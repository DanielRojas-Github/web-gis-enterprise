export function featureToGeoJSON(
  feature
) {

  if (
    feature.type ===
    'point'
  ) {

    return {
      type: 'Feature',

       id: feature.id,

      geometry: {
        type: 'Point',
       

        coordinates: [
          feature.points[0].lng,
          feature.points[0].lat,
        ],
      },

      properties: {},
    }
  }

  if (
    feature.type ===
    'polyline'
  ) {

    return {
      type: 'Feature',

       id: feature.id,

      geometry: {
        type: 'LineString',

        coordinates:
          feature.points.map(
            point => [
              point.lng,
              point.lat,
            ]
          ),
      },

      properties: {},
    }
  }

  if (
    feature.type ===
    'polygon'
  ) {

    return {
      type: 'Feature',

       id: feature.id,

      geometry: {
        type: 'Polygon',

        coordinates: [[

          ...feature.points.map(
            point => [
              point.lng,
              point.lat,
            ]
          ),

          [
            feature.points[0].lng,
            feature.points[0].lat,
          ],

        ]],
      },

      properties: {},
    }
  }

  return null
}

export function featuresToGeoJSON(
  features
) {

  return {

    type:
      'FeatureCollection',

    features:

      features
        .map(
          featureToGeoJSON
        )
        .filter(Boolean),
  }
}