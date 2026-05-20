import WMSRenderer from '@/gis/layers/renderers/WMSRenderer'
import TileRenderer from '@/gis/layers/renderers/TileRenderer'

export const layerFactory = (layer) => {
  switch (layer.type) {
    case 'WMS':
      return ( <WMSRenderer layer={layer} />)

    case 'tile':
      return (<TileRenderer layer={layer} />)

    default:
      return null
  }
}