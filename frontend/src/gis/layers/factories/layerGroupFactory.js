import {
  LAYER_TYPES,
} from '../registry/layerSchema'


export const createLayerGroup = ({
  id,
  name,
  visible = true,
  expanded = true,
  children = [],
  metadata = {},
}) => ({

  id,
  name,

  type:
    LAYER_TYPES.GROUP,

  visible,
  expanded,
  children,

  metadata,
})