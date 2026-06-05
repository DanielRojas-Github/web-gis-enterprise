import {
    importGeoJSONResponse,
}
    from '@/gis/import/services/geojsonImportService'

export async function
    loadWFSFeatures(
        url
    ) {
         console.log(
    'loadWFSFeatures ejecutada'
  )

    const response =
        await fetch(url)

    if (!response.ok) {

        throw new Error(
            'Error consultando WFS'
        )
    }

    const geojson =
        await response.json()
          console.log(
    'GeoJSON recibido:',
    geojson
  )

    return importGeoJSONResponse(
        geojson
    )
}