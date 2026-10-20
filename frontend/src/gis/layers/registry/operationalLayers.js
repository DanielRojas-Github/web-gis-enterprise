import {
  geoserverConfig,
}
  from '@/gis/services/geoserver/geoserverConfig'

import {
  createLayer,
  LAYER_TYPES,
}
  from './layerSchema'

import {
  createLayerGroup,
}
  from '../factories/layerGroupFactory'

import {
  SOURCE_TYPES,
}
from './sourceTypes'

export const operationalLayers = [


  createLayerGroup({

    id:
      'administrative',

    name:
      'Administrative',

    visible:
      true,

    expanded:
      true,

    children: [

      createLayer({

        id:
          'departments',

        name:
          'Departments',

        type:
          LAYER_TYPES.WMS,

        visible:
          true,

        opacity:
          1,

        zIndex:
          100,

        source: {

          url:
            geoserverConfig.wmsUrl,

          layers:
            `${geoserverConfig.workspace}:departments`,
        },

        metadata: {

          attribution:
            'Administrative Dataset',

          geometryType:
            'Polygon',

          crs:
            'EPSG:4326',

          category:
            'administrative',

          keywords: [
            'administrative',
            'boundaries',
          ],
        },
      }),

      createLayer({

        id:
          'buildings-wfs',

        name:
          'Buildings',

        type:
          LAYER_TYPES.VECTOR,

        visible:
          false,

        opacity:
          1,

        zIndex:
          101,

        source: {

          type:
            SOURCE_TYPES.WFS,

          layerName:
            'buildings',
        },

        metadata: {

          attribution:
            'Buildings Dataset',

          geometryType:
            'Polygon',

          crs:
            'EPSG:4326',

          category:
            'administrative',

          keywords: [
            'buildings',
            'structures',
          ],
        },
      }),
    ],
  }),

  createLayerGroup({

    id:
      'hydrology',

    name:
      'Hydrology',


    visible:
      true,

    expanded:
      true,

    children: [

      createLayer({

        id:
          'rivers',

        name:
          'Rivers',

        type:
          LAYER_TYPES.WMS,

        visible:
          true,

        opacity:
          1,

        zIndex:
          2,

        source: {

          url:
            geoserverConfig.wmsUrl,

          layers:
            `${geoserverConfig.workspace}:rivers`,
        },

        metadata: {

          attribution:
            'Hydrology Dataset',

          geometryType:
            'LineString',

          crs:
            'EPSG:4326',

          category:
            'hydrology',

          keywords: [
            'hydrology',
            'water',
          ],
        },
      }),
    ],
  }),

  createLayerGroup({
    id:
      'transportation',

    name:
      'Transportation',


    visible:
      true,

    expanded:
      true,

    children: [

      createLayer({

        id:
          'roads',

        name:
          'Roads',

        type:
          LAYER_TYPES.WMS,

        visible:
          true,

        opacity:
          1,

        zIndex:
          3,

        source: {

          url:
            geoserverConfig.wmsUrl,

          layers:
            `${geoserverConfig.workspace}:roads`,
        },

        metadata: {

          attribution:
            'Transportation Dataset',

          geometryType:
            'LineString',

          crs:
            'EPSG:4326',

          category:
            'transportation',

          keywords: [
            'roads',
            'transport',
          ],
        },
      }),

      createLayer({

        id:
          'roads-wfs',

        name:
          'Roads WFS',

        type:
          LAYER_TYPES.VECTOR,

        visible:
          false,

        opacity:
          1,

        zIndex:
          4,

        source: {

          type:
            SOURCE_TYPES.WFS,

          layerName:
            'roads',
        },

        metadata: {

          attribution:
            'Transportation Dataset',

          geometryType:
            'LineString',

          crs:
            'EPSG:4326',

          category:
            'transportation',

          keywords: [
            'roads',
            'transport',
            'wfs',
          ],
        },
      }),
    ],
  }),

  createLayerGroup({
    id:
      'imported-layers',

    name:
      'Imported Layers',


    visible:
      true,

    expanded:
      true,

    children: [],
  }),
];
