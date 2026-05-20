import { geoserverConfig } from '../geoserver/geoserverConfig'

export const buildWMSUrl = ({
  layer,
}) => {
  return `${geoserverConfig.wmsUrl}?service=WMS&version=1.1.1&request=GetMap&layers=${layer}&styles=&format=image/png&transparent=true`
}