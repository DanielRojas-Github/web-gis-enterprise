export const parseFeatures = (
  geojson
) => {
  return geojson.features.map(
    (feature) => ({
      id: feature.id,

      geometry: feature.geometry,

      properties: feature.properties,
    })
  )
}