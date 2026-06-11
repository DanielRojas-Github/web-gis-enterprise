export const createLayer = ({
  id,
  name,
  type,

  source = {},

  visible = true,

  opacity = 1,

  zIndex = 0,

  metadata = {},
  
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

  metadata,

  expanded ,

  children,
})

export const LAYER_TYPES = {
  TILE: 'tile',

  WMS: 'wms',

  WFS: 'wfs',

  VECTOR: 'vector',

  GEOJSON: 'geojson',

  GROUP: 'group',
}