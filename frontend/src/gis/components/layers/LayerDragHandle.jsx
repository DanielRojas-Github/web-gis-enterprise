const LayerDragHandle = ({
  onDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="layer-drag-handle"
    >
      ☰
    </div>
  )
}

export default LayerDragHandle