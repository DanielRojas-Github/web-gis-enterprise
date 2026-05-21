export const operationalLayers = [
  {
    id: 'environment',

    name: 'Environment',

    type: 'group',

    expanded: true,

    visible: true,

    children: [
      {
        id: 'departments',

        name: 'Departments',

        type: 'WMS',

        visible: true,

        opacity: 1,

        zIndex: 100,

        url:
          'http://localhost:8080/geoserver/wms',

        layers:
          'gis:departments',

        legendUrl:
          'https://dummyimage.com/120x30/009933/ffffff.png&text=Departments',
      },

      {
        id: 'rivers',

        name: 'Rivers',

        type: 'WMS',

        visible: true,

        opacity: 1,

        zIndex: 101,

        url:
          'http://localhost:8080/geoserver/wms',

        layers:
          'gis:rivers',

        legendUrl:
          'https://dummyimage.com/120x30/4da6ff/ffffff.png&text=Rivers',
      },
    ],
  },
]