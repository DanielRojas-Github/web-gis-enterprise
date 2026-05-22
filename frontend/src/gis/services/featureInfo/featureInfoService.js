import { geoserverConfig } from '../geoserver/geoserverConfig'

export const getFeatureInfo = async ({
  layer,
  lat,
  bbox,
  width,
  height,
  x,
  y,
}) => {
  const url =
    `${geoserverConfig.wmsUrl}` +
    `?service=WMS` +
    `&version=1.1.1` +
    `&request=GetFeatureInfo` +
    `&layers=${layer}` +
    `&query_layers=${layer}` +
    `&info_format=application/json` +
    `&bbox=${bbox}` +
    `&feature_count=10` +
    `&height=${height}` +
    `&width=${width}` +
    `&x=${x}` +
    `&y=${y}` +
    `&srs=EPSG:4326`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      'FeatureInfo request failed'
    )
  }

  return response.json()
}