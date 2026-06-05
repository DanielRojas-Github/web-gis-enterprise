export function
geoJSONToFeature(
  feature
) {

  const geometry =
    feature.geometry

  if (
    geometry.type ===
    'Point'
  ) {

    return {

      id:
        feature.id ??
        crypto.randomUUID(),

      type: 'point',

      points: [
        {
          lat:
            geometry.coordinates[1],

          lng:
            geometry.coordinates[0],
        },
      ],
    }
  }

  if (
    geometry.type ===
    'LineString'
  ) {

    return {

      id:
        feature.id ??
        crypto.randomUUID(),

      type:
        'polyline',

      points:
        geometry.coordinates.map(
          coordinate => ({
            lat:
              coordinate[1],

            lng:
              coordinate[0],
          })
        ),
    }
  }

  if (
    geometry.type ===
    'Polygon'
  ) {

    return {

      id:
        feature.id ??
        crypto.randomUUID(),

      type:
        'polygon',

      points:
        geometry.coordinates[0]
          .slice(0, -1)
          .map(
            coordinate => ({
              lat:
                coordinate[1],

              lng:
                coordinate[0],
            })
          ),
    }
  }

  return null
}

export function
geoJSONCollectionToFeatures(
  geojson
) {

  return geojson.features

    .map(
      geoJSONToFeature
    )

    .filter(Boolean)
}