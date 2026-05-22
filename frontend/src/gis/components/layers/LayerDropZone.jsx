import { useLayers }
  from '@/store/layers/hooks/useLayers'

import { LAYER_ACTIONS }
  from '@/store/layers/layerActions'

const LayerDropZone = ({
  groupId,
}) => {

  const { dispatch } =
    useLayers()

  const handleDrop =
    (event) => {

      event.preventDefault()

      const layerId =
        event.dataTransfer.getData(
          'layerId'
        )

      dispatch({
        type:
          LAYER_ACTIONS
            .MOVE_NODE,

        payload: {
          nodeId:
            layerId,

          targetGroupId:
            groupId,
        },
      })
    }

  const handleDragOver =
    (event) => {
      event.preventDefault()
    }

  return (
    <div
      className="layer-drop-zone"

      onDrop={
        handleDrop
      }

      onDragOver={
        handleDragOver
      }
    >
      Drop Here
    </div>
  )
}

export default
  LayerDropZone