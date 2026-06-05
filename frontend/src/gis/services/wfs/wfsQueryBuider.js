export function
buildWFSGetFeatureURL({

  baseUrl,

  workspace,

  layerName,

}) {

  const params =
    new URLSearchParams({

      service: 'WFS',

      version: '2.0.0',

      request: 'GetFeature',

      typeName:
        `${workspace}:${layerName}`,

      outputFormat:
        'application/json',
    })

  return `${baseUrl}?${params}`
}