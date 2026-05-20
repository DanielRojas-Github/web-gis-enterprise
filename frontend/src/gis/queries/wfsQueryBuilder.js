export const buildWFSQuery = ({
  typeName,
}) => {
  return {
    service: 'WFS',

    version: '1.1.0',

    request: 'GetFeature',

    typeName,

    outputFormat: 'application/json',
  }
}