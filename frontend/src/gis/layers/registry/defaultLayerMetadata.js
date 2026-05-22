export const defaultLayerMetadata = {

  capabilities: {

    queryable: true,

    editable: false,

    exportable: false,

    downloadable: false,
  },

  scale: {

    min: 0,

    max: Infinity,
  },

  permissions: [
    'viewer',
  ],

  metadata: {

    attribution:
      'Web GIS Enterprise',

    geometryType:
      null,

    crs:
      'EPSG:4326',

    serviceType:
      null,

    source:
      'GeoServer',

    version:
      '1.0.0',

    category:
      null,

    keywords: [],

    tags: [],
  },

  temporal: {

    enabled: false,

    field: null,
  },
}