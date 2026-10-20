import {
  defaultLayerMetadata,
}
from './defaultLayerMetadata'

export const createLayer = ({
  id,
  name,
  type,
  source = {},
  visible = true,
  opacity = 1,
  zIndex = 0,
  capabilities = {},
  scale = {},
  permissions,
  metadata = {},
  temporal = {},
  expanded = false,
  children = [],
}) => ({

  id,

  name,

  type,

  source,

  visible,

  opacity,

  zIndex,

  capabilities: {
    ...defaultLayerMetadata.capabilities,
    ...capabilities,
  },

  scale: {
    ...defaultLayerMetadata.scale,
    ...scale,
  },

  permissions:
    permissions ??
    defaultLayerMetadata.permissions,

  metadata: {
    ...defaultLayerMetadata.metadata,
    ...metadata,
  },

  temporal: {
    ...defaultLayerMetadata.temporal,
    ...temporal,
  },

  expanded,

  children,

  dirty: false,

  loading: false,

  saving: false,

  lastSaved: null,

  error: null,

  syncError: null,
})

export const LAYER_TYPES = {

  TILE: 'tile',

  WMS: 'wms',

  VECTOR: 'vector',

  GROUP: 'group',
}