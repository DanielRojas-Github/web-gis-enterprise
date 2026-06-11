import { defaultLayerMetadata } from '@/gis/layers/registry/defaultLayerMetadata'
import { geoserverConfig } from '@/gis/services/geoserver/geoserverConfig'
import { createLayer, LAYER_TYPES } from './layerSchema'
export const operationalLayers = [
  {
    id: 'administrative',

    name: 'Administrative',

    type: LAYER_TYPES.GROUP,

    visible: true,

    expanded: true,

    children: [

     createLayer( {
        id: 'departments',

        name: 'Departments',

        type: LAYER_TYPES.WMS,

        visible: true,

        opacity: 1,

        zIndex: 100,
      source: { 
        url:
          'http://localhost:8080/geoserver/wms',

        layers:
          `${geoserverConfig.workspace}:departments`,
        },

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
      
    }),
    ]
  },

  {
    id: 'hydrology',

    name: 'Hydrology',

    type: LAYER_TYPES.GROUP,

    visible: true,

    expanded: true,

    children: [

    createLayer( { 
        id: 'rivers',

        name: 'Rivers',

        type: LAYER_TYPES.WMS,

        visible: true,

        opacity: 1,

        zIndex: 2,
        source: {

        url:
          'http://localhost:8080/geoserver/wms',

        layers:
         `${geoserverConfig.workspace}:rivers`,
        },

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
      
    }),
    ],
  },

  {
    id: 'transportation',

    name: 'Transportation',

    type: LAYER_TYPES.GROUP,

    visible: true,

    expanded: true,

    children: [

    createLayer( 
      
      {
        id: 'roads',

        name: 'Roads',

        type: LAYER_TYPES.WMS,

        visible: true,

        opacity: 1,

        zIndex: 3,

        source: {

        url:
          'http://localhost:8080/geoserver/wms',

        layers:
          `${geoserverConfig.workspace}:roads`,
        },

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
    ), 
    ],
  },
     {
  id: 'imported-layers',

  name: 'Imported Layers',

  type: LAYER_TYPES.GROUP,

  visible: true,

  expanded: true,

  children: [],
}


]