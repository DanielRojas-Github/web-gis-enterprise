import { ENV } from '@config/env'

export const buildWFSUrl = (layerName) => {
  return `
    ${ENV.GEOSERVER_URL}/ows?
    service=WFS&
    version=1.0.0&
    request=GetFeature&
    typeName=${ENV.GEOSERVER_WORKSPACE}:${layerName}&
    outputFormat=application/json
  `
}