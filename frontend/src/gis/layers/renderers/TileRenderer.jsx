import {
  TileLayer,
} from 'react-leaflet'

const TileRenderer = ({
  layer,
}) => {

  if (!layer.visible) {
    return null
  }

  return (
    <TileLayer
      url={
        layer.source.url
      }

      opacity={
        layer.opacity
      }

      zIndex={
        layer.zIndex
      }
    />
  )
}

export default TileRenderer