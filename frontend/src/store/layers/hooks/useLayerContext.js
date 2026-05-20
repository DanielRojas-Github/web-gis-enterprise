import { useContext } from 'react'

import { LayerContext }
  from '@/store/layers/LayerContext'

export const useLayerContext = () => {
  return useContext(LayerContext)
}