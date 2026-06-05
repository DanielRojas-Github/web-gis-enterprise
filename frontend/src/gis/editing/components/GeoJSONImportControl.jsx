import { drawState }
from '@/gis/tools/overlays/draw/drawStore'

import {
  geoJSONCollectionToFeatures
}
from '@/gis/tools/overlays/draw/importGeoJSON'

import {
  validateGeoJSON,
}
from '@/gis/import/validators/geojsonValidator'

import {
  importGeoJSONFile,
}
from '@/gis/import/services/geojsonImportService'

export default function
GeoJSONImportControl() {

const handleImport =
  async event => {

    try {

      const file =
        event.target.files[0]

      if (!file) {
        return
      }

      const importedFeatures =

        await importGeoJSONFile(
          file
        )

      console.log(

        'Features importadas:',

        importedFeatures

      )

    } catch (error) {

      console.error(
        error.message
      )

      alert(
        error.message
      )
    }
  }

  return (

    <input
      type="file"
      accept=".geojson,.json"
      onChange={
        handleImport
      }
    />
  )
}