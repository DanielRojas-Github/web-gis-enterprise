import { useLayers }
  from '@/store/layers/hooks/useLayers'

import { LAYER_ACTIONS }
  from '@/store/layers/layerActions'

import LayerItem from './LayerItem'

import LayerDragHandle
  from './LayerDragHandle'

const DraggableLayerItem = ({
  layer,
}) => {
  const { dispatch } =
    useLayers()

  const handleDrop = (
    event
  ) => {
    event.preventDefault()

    const draggedLayerId =
      event.dataTransfer.getData(
        'layerId'
      )

    dispatch({
      type:
        LAYER_ACTIONS.REORDER_LAYERS,

      payload: {
        draggedLayerId,
        targetLayerId: layer.id,
      },
    })
  }

  const handleDragOver = (
    event
  ) => {
    event.preventDefault()
  }

  const handleDragStart = (
    event
  ) => {
    event.dataTransfer.setData(
      'layerId',
      layer.id
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="draggable-layer-item"
    >
      <LayerDragHandle
        onDragStart={
          handleDragStart
        }
      />

      <LayerItem layer={layer} />
    </div>
  )
}

export default DraggableLayerItem