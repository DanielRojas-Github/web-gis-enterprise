import { WMSTileLayer } from 'react-leaflet'

const WMSRenderer = ({ layer }) => {
  if (!layer.visible) return null

  return (
    <WMSTileLayer
      url={layer.url}
      layers={layer.layers}
      format="image/png"
      transparent={true}
      opacity={layer.opacity}
      zIndex={layer.zIndex}
    />
  )
}

export default WMSRenderer