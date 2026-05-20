import { useGISContext } from './useGISContext'

export const useGIS = () => {
  const { state, dispatch } = useGISContext()

  return {
    state,
    dispatch,
  }
}