import { geoserverConfig } from '../geoserver/geoserverConfig'

export const getWFSFeatures =
  async ({
    layer,
  }) => {

    const typeName =
`${geoserverConfig.workspace}:${layer}`

    const url =
`${geoserverConfig.wfsUrl}?service=WFS&version=2.0.0&request=GetFeature&typeNames=${typeName}&outputFormat=application/json`

    const response =
      await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Error loading WFS layer: ${layer}`
      )
    }

    return response.json()
  }