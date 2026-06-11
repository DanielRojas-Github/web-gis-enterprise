import { WMSTileLayer } from 'react-leaflet'

const WMSRenderer = ({ layer }) => {
  if (!layer.visible) return null

  return (
    <WMSTileLayer
      url={layer.source.url}
      layers={layer.source.layers}
      format="image/png"
      transparent={true}
      opacity={layer.source.opacity}
      zIndex={layer.source.zIndex}
    />
  )
}

export default WMSRenderer