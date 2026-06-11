import { TileLayer } from 'react-leaflet'

const TileRenderer = ({ layer }) => {
  if (!layer.visible) return null

  return (
    <TileLayer
      url={layer.source.url}
      opacity={layer.source.opacity}
      zIndex={layer.source.zIndex}
    />
  )
}

export default TileRenderer