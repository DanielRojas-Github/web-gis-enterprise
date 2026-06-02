const LayerDragHandle = ({ // Recibe la función onDragStart como prop para manejar el inicio del arrastre
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