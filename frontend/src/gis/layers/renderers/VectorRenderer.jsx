import {
  GeoJSON,
} from 'react-leaflet'

const VectorRenderer = ({
  layer
}) => {
  console.log(
  'VECTOR DATA:',
  JSON.stringify(
    layer.source.features,
    null,
    2
  )
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