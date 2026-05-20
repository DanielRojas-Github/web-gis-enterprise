import { geoserverConfig } from '../geoserver/geoserverConfig'

export const getWFSFeatures = async ({
  layer,
}) => {
  const url = `${geoserverConfig.wfsUrl}?service=WFS&version=1.1.0&request=GetFeature&typeName=${layer}&outputFormat=application/json`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      'Error fetching WFS features'
    )
  }

  return response.json()
}