import {
  useEffect,
  useRef,
} from 'react'

import {
  useLayers,
} from '@/store/layers/hooks/useLayers'

import {
  LAYER_ACTIONS,
} from '@/store/layers/layerActions'

import {
  getGroupVisibilityState,
} from '@/gis/utils/getGroupVisibilityState'

import LayerDropZone
  from '../LayerDropZone'

import DraggableLayerItem
  from '../DraggableLayerItem'

const LayerGroup = ({
  group,
}) => {

  const { dispatch } =
    useLayers()

  const checkboxRef =
    useRef(null)

  const visibilityState =
    getGroupVisibilityState(
      group
    )

  const handleToggleGroup =
    (event) => {

      event.stopPropagation()

      dispatch({
        type:
          LAYER_ACTIONS
            .TOGGLE_GROUP,

        payload:
          group.id,
      })
    }

  useEffect(() => {

    if (
      checkboxRef.current
    ) {

      checkboxRef.current
        .indeterminate =
          visibilityState
            .indeterminate
    }

  }, [visibilityState])

  return (
    <div className="layer-group">

      <div className="layer-group-header">

        <div
          className="
            layer-group-title
          "

          onClick={() =>
            dispatch({
              type:
                LAYER_ACTIONS
                  .TOGGLE_GROUP_EXPANDED,

              payload:
                group.id,
            })
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