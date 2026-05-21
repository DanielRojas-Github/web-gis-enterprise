import { useState }
  from 'react'

import LayerItem
  from '../LayerItem'

import { useLayers }
  from '@/store/layers/hooks/useLayers'

import { LAYER_ACTIONS }
  from '@/store/layers/layerActions'

const LayerGroup = ({
  group,
}) => {

  const [
    expanded,
    setExpanded,
  ] = useState(
    group.expanded
  )

  const { dispatch } =
    useLayers()

  const handleToggleGroup =
    (event) => {

      event.stopPropagation()

      dispatch({
        type:
          LAYER_ACTIONS.TOGGLE_GROUP,

        payload:
          group.id,
      })
    }

  return (
    <div className="layer-group">

      <div className="layer-group-header">

        <div
          className="layer-group-title"
          onClick={() =>
            setExpanded(
              !expanded
            )
          }
        >
          {expanded
            ? '▼'
            : '▶'}{' '}

          {group.name}
        </div>

        <input
          type="checkbox"
          checked={
            group.visible
          }
          onChange={
            handleToggleGroup
          }
        />

      </div>

      {expanded && (
        <div className="layer-group-children">

          {group.children.map(
            (child) => {

              if (
                child.type ===
                'group'
              ) {
                return (
                  <LayerGroup
                    key={
                      child.id
                    }
                    group={
                      child
                    }
                  />
                )
              }

              return (
                <LayerItem
                  key={
                    child.id
                  }
                  layer={
                    child
                  }
                />
              )
            }
          )}

        </div>
      )}

    </div>
  )
}

export default LayerGroup