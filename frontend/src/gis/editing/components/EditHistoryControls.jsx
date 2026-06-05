import { drawState }
  from '@/gis/tools/overlays/draw/drawStore'

import {
  editHistoryStore,
}
from '@/gis/editing/history/editHistoryStore'

export default function
EditHistoryControls() {

  const handleUndo =
    () => {

      const previousState =

        editHistoryStore.undo(
          drawState.features
        )

      if (
        !previousState
      ) {
        return
      }

      drawState.setFeatures(
        previousState
      )
    }

  const handleRedo =
    () => {

      const nextState =

        editHistoryStore.redo(
          drawState.features
        )

      if (
        !nextState
      ) {
        return
      }

      drawState.setFeatures(
        nextState
      )
    }

  return (

    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
      }}
    >

      <button
        onClick={handleUndo}
      >
        Undo
      </button>

      <button
        onClick={handleRedo}
      >
        Redo
      </button>

    </div>
  )
}