import LayerItem
  from './LayerItem'

import LayerDragHandle
  from './LayerDragHandle'

const DraggableLayerItem = ({ // Recibe la capa como prop para renderizar su información y manejar el arrastre
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