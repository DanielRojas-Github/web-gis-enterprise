import {
  useEffect,
  useRef,
} from 'react'

import {
  useLayers,
} from '@/store/layers/hooks/useLayers'

import {
  useGIS,
} from '@/store/gis/hooks/useGIS'



import {
  synchronizationManager,
} from '@/gis/synchronization/SynchronizationManager'


export const useAutosave = () => {
  const {
    layers

  } = useLayers()

  const {
    state,
  } = useGIS()

  const layersRef =
    useRef(layers)

  // Mantener siempre la última versión de las capas
  useEffect(() => {
    layersRef.current =
      layers
  }, [layers])

  useEffect(() => {


    if (!state.autosave) {

      return
    }


    const interval =
      setInterval(async () => {
        console.log(
          '=========================='
        )

        const currentLayers =
          layersRef.current

synchronizationManager
    .processAutosave(
        currentLayers
    )

     
      },
        state.autosaveInterval
      )

    return () => {


      clearInterval(
        interval
      )
    }
  }, [

    state.autosave,
    state.autosaveInterval,
  ])
}