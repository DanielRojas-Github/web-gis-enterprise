import {
  useEffect,
  useRef,
} from 'react'

import {
  useLayers,
} from '@/store/layers/hooks/useLayers'

// import {
//   LAYER_ACTIONS,
// } from '@/store/layers/layerActions'

import {
  getGroupVisibilityState,
} from '@/gis/utils/getGroupVisibilityState'

import LayerDropZone
  from '../LayerDropZone'

import DraggableLayerItem
  from '../DraggableLayerItem'

import {
  LAYER_TYPES,
}
  from '@/gis/layers/registry/layerSchema'

const LayerGroup = ({
  group,
}) => {



  const {
    toggleGroup,
    toggleGroupExpanded,
  } = useLayers()

  const checkboxRef =
    useRef(null)

  const visibilityState =
    getGroupVisibilityState(
      group
    )

  const handleToggleGroup =
    (event) => {

      event.stopPropagation()

      toggleGroup(group.id)
    }

  useEffect(() => {

    if (checkboxRef.current) {

      if (group.id) {
        checkboxRef.current.indeterminate = visibilityState.indeterminate
      }
    } 
  }, [visibilityState .indeterminate])   

return (
  <div className="layer-group">

    <div className="layer-group-header">

      <div
        className="
            layer-group-title
          "

        onClick={() =>
          toggleGroupExpanded(
            group.id
          )
        }
      >
        {group.expanded
          ? '▼'
          : '▶'}{' '}

        {group.name}
      </div>

      <input
        ref={checkboxRef}

        type="checkbox"

        checked={
          visibilityState.checked
        }

        onChange={
          handleToggleGroup
        }
      />

    </div>

    <LayerDropZone
      groupId={group.id}
    />

    {group.expanded && (

      <div
        className="
            layer-group-children
          "
      >

        {group.children.map(
          (child) => {

            if (
              child.type ===
              LAYER_TYPES.GROUP
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
              <DraggableLayerItem
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