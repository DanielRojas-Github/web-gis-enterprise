import { useGISContext } from '../gisContext'

export const useGIS = () => {
  const { state, dispatch } = useGISContext()

  return {
    state,
    dispatch,
  }
}