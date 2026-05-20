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
]