const LayerOrderingControls = ({
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div className="layer-order-controls">
      <button onClick={onMoveUp}>
        ↑
      </button>

      <button onClick={onMoveDown}>
        ↓
      </button>
    </div>
  )
}

export default LayerOrderingControls