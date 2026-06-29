export const gisInitialState = {

  map: null,

  selectedFeature: null,

  selectedFeatures: [],
  
  editingFeature: null,
  
  isEditing: false,
  
  mapCenter: [
    -17.7833,
    -63.1821,
  ]
  
  ,

  zoom: 6,

  activeTool: 'IDENTIFY',

  loading: false,

  error: null,

  featureInfo: null,

  drawMode: false,

  measurements: [],

  filters: {},

  visibleLayers: [],

  user: {
    role: 'viewer',
  },
  autosave: true,
autosaveInterval: 5000, // 5 segundos
}