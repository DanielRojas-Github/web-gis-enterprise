import { ENV } from '@config/env'

export const buildWMSLayer = (layerName) => {
  return {
    url: `${ENV.GEOSERVER_URL}/wms`,

    params: {
      layers: `${ENV.GEOSERVER_WORKSPACE}:${layerName}`,
      format: 'image/png',
      transparent: true,
    },
  }
}