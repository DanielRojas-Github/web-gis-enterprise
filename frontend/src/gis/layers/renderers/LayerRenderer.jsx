import WMSRenderer
  from './WMSRenderer'

const LayerRenderer = ({
  layer,
}) => {

  switch (layer.type) {

    case 'WMS':
      return (
        <WMSRenderer
          layer={layer}
        />
      )

    default:
      return null
  }
}

export default LayerRenderer