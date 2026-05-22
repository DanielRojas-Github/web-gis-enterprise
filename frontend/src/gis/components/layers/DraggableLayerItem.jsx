import LayerItem
  from './LayerItem'

import LayerDragHandle
  from './LayerDragHandle'

const DraggableLayerItem = ({
  layer,
}) => {

  const handleDragStart =
    (event) => {

      event.dataTransfer.setData(
        'layerId',

        layer.id
      )
    }

  return (
    <div
      draggable

      onDragStart={
        handleDragStart
      }

      className="
        draggable-layer-item
      "
    >
      <LayerDragHandle />

      <LayerItem
        layer={layer}
      />
    </div>
  )
}

export default
  DraggableLayerItem