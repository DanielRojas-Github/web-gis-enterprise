import LayerItem from './LayerItem'

const LayerGroup = ({
  group,
  toggleGroup,
  toggleLayer
}) => {
  return (
    <div className="layer-group">
      <div className="group-header">
        <input
          type="checkbox"
          checked={group.visible}
          onChange={() =>
            toggleGroup(group.id)
          }
        />

        <span>{group.name}</span>
      </div>

      <div className="group-children">
        {group.children.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            toggleLayer={toggleLayer}
          />
        ))}
      </div>
    </div>
  )
}

export default LayerGroup