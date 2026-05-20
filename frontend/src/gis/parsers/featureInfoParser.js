export const parseFeatureInfo = (
  data
) => {
  if (
    !data.features ||
    data.features.length === 0
  ) {
    return null
  }

  const feature = data.features[0]

  return {
    id: feature.id,

    geometry: feature.geometry,

    properties: feature.properties,

    coordinates:
      feature.geometry.coordinates,

    source: 'WMS',
  }
}