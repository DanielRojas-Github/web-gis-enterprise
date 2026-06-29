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
        className="
    draggable-layer-item
  "

      onDragStart={
        handleDragStart
      }

    
    >
      <LayerDragHandle   onDragStart={
    handleDragStart
  } />

      <LayerItem
        layer={layer}
      />
    </div>
  )
}

export default
  DraggableLayerItem