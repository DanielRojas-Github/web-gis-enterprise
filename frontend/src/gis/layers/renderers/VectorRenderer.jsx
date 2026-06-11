import {
  GeoJSON,
} from 'react-leaflet'

const VectorRenderer = ({
  layer,
}) => {
  console.log(
    'VECTOR DATA:',
    layer.source.features
  )
  if (!layer.visible) {
    return null
  }

  return (
    <GeoJSON
      data={
        layer.source.features
      }
    />
  )
}

export default VectorRenderer