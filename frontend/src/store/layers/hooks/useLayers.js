import {  useLayerContext  } from '@/store/layers/hooks/useLayerContext'

export const useLayers = () => {
  const { state, dispatch } =
    useLayerContext()// This hook provides access to the layer context, allowing components to read the current state of layers and dispatch actions to update that state.

  return {
    state,
    dispatch,
  }
}