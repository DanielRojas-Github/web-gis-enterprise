import {
  loadWFSLayer,
}
  from '@/gis/layers/loaders/wfsLayerLoader'

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

        const layer =
          await loadWFSLayer({
            layerName:
              'roads',
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