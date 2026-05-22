import { defaultLayerMetadata } from '@/gis/layers/registry/defaultLayerMetadata'
import { geoserverConfig } from '@/gis/services/geoserver/geoserverConfig'
export const operationalLayers = [

  {
    id: 'administrative',

    name: 'Administrative',

    type: 'group',

    visible: true,

    expanded: true,

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
          `${geoserverConfig.workspace}:departments`,

        ...defaultLayerMetadata,

        metadata: {

          attribution:
            'Administrative Dataset',

          geometryType:
            'Polygon',

          crs: 'EPSG:4326',

          category: 'administrative',

          keywords: [
            'administrative',
            'boundaries',
          ],
        },
      },
    ],
  },

  {
    id: 'hydrology',

    name: 'Hydrology',

    type: 'group',

    visible: true,

    expanded: true,

    children: [

      {
        id: 'rivers',

        name: 'Rivers',

        type: 'WMS',

        visible: true,

        opacity: 1,

        zIndex: 2,

        url:
          'http://localhost:8080/geoserver/wms',

        layers:
         `${geoserverConfig.workspace}:rivers`,

        ...defaultLayerMetadata,

        metadata: {

          attribution:
            'Hydrology Dataset',

          geometryType:
            'LineString',

          crs: 'EPSG:4326',

          category: 'hydrology',

          keywords: [
            'hydrology',
            'water',
          ],
        },
      },
    ],
  },

  {
    id: 'transportation',

    name: 'Transportation',

    type: 'group',

    visible: true,

    expanded: true,

    children: [

      {
        id: 'roads',

        name: 'Roads',

        type: 'WMS',

        visible: true,

        opacity: 1,

        zIndex: 3,

        url:
          'http://localhost:8080/geoserver/wms',

        layers:
          `${geoserverConfig.workspace}:roads`,

        ...defaultLayerMetadata,

        metadata: {

          attribution:
            'Transportation Dataset',

          geometryType:
            'LineString',

          crs: 'EPSG:4326',

          category: 'transportation',

          keywords: [
            'roads',
            'transport',
          ],
        },
      },
    ],
  },
]