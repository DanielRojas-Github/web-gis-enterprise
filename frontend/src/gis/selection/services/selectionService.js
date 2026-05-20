import { getFeatureInfo } from '@/gis/services/featureInfo/featureInfoService'

import { parseFeatureInfo } from '@/gis/parsers/featureInfoParser'

export const selectFeature = async ({
  layer,
  params,
}) => {
  const response =
    await getFeatureInfo({
      layer,
      ...params,
    })

  return parseFeatureInfo(response)
}