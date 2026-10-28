import api from '@/services/api/axios'

import {
  createVectorLayer,
} from '../factories/vectorLayerFactory'

import {
  SOURCE_TYPES,
} from '../registry/sourceTypes'

const isFeatureCollection = (value) => (
  value?.type === 'FeatureCollection' &&
  Array.isArray(value.features)
)

export const loadApiLayer = async (layer) => {
  const response = await api.get(layer.source.endpoint)
  const geojson = response.data?.data

  if (!response.data?.success || !isFeatureCollection(geojson)) {
    throw new Error('Invalid GIS layer response')
  }

  return createVectorLayer({
    ...layer,
    geojson,
    source: {
      ...layer.source,
      type: SOURCE_TYPES.API,
    },
  })
}
