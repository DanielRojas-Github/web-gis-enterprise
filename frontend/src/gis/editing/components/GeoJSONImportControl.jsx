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
          console.log('Archivo seleccionado:', file.name)

        if (!file) {
          return
        }

        const {
          geojson,
        } =
          await importGeoJSONFile(
            file
          )
          console.log(
  'GeoJSON recibido:',
  geojson
)

        const layer =
          createVectorLayer({

            id:
              `geojson-${Date.now()}`,

            name:
              file.name,

            geojson,
          })
        console.log(
  'Layer creada:',
  layer
)
console.log(
  'Agregando layer al grupo imported-layers'
)
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