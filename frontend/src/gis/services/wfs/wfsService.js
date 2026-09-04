import {
  getWFSFeatures,
} from './wfsApi'

const isFeatureCollection = (
  value
) => {

  return (
    value?.type ===
      'FeatureCollection' &&
    Array.isArray(
      value.features
    )
  )
}

export const loadWFSFeatures =
  async ({
    typeName,
    params = {},
    signal,
  }) => {

    const response =
      await getWFSFeatures({
        typeName,
        params,
        signal,
      })

    if (
      !response?.success ||
      !isFeatureCollection(
        response.data
      )
    ) {

      throw new Error(
        'Invalid WFS response'
      )
    }

    return response.data
  }