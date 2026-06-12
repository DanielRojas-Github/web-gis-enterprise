import {
  loadWFSFeatures,
}
  from '@/gis/services/wfs/wfsFeatureService'

import {
  createVectorLayer,
}
  from '@/gis/layers/factories/vectorLayerFactory'

import {
  useLayers,
}
  from '@/store/layers/hooks/useLayers'

export default function
  WFSLoadButton() {
  const {
    addLayerToGroup,
  } = useLayers()
  const handleClick =
    async () => {

      try {

        const geojson =
          await loadWFSFeatures(
            'http://localhost:3000/api/wfs/roads'
          )
        console.log(
  'WFS RESULT:',
  geojson
)
        const layer =
          createVectorLayer({

            id:
              `wfs-${Date.now()}`,

            name:
              'roads',

            geojson,
          })

        addLayerToGroup({

          groupId:
            'imported-layers',

          layer,
        })

      } catch (error) {

        console.error(error)
      }
    }

  return (

    <button
      onClick={handleClick}
    >
      Cargar WFS
    </button>
  )
}