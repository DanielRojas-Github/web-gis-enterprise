import {
  importGeoJSONFile,
}
  from '@/gis/import/services/geojsonImportService'

import {
  useLayers,
}
  from '@/store/layers/hooks/useLayers'

import {
  createVectorLayer,
}
  from '@/gis/layers/factories/vectorLayerFactory'

export default function GeoJSONImportControl() {

  const {
    addLayerToGroup,
  } = useLayers()

  const handleImport =
    async (event) => {

      try {

        const file =
          event.target.files[0]


        if (!file) {
          return
        }

        const geojson =
          await importGeoJSONFile(
            file
          )



        const layer =
          createVectorLayer({

            id:
              `geojson-${Date.now()}`,

            name:
              file.name,

            geojson,
          })


        addLayerToGroup({

          groupId:
            'imported-layers',

          layer,
        })

      } catch (error) {

        console.error(
          error
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