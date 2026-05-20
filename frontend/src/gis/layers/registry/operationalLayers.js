export const operationalLayers = [
  {
    id: 'departments',

    name: 'Departments',

    type: 'WMS',

    visible: true,

    opacity: 1,

    zIndex: 100,

    url: 'http://localhost:8080/geoserver/wms',

    layers: 'gis:departments',
  },
  
  {
  id: 'rivers',

  name: 'Rivers',

  type: 'WMS',

  visible: true,

  opacity: 1,

  zIndex: 2,

  url: '...',

  layers: 'workspace:rivers',

  legendUrl:
    'https://dummyimage.com/120x30/4da6ff/ffffff.png&text=Rivers'
}
]