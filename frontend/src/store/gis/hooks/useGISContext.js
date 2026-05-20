import { useContext } from 'react'

import { GISContext } from '../gisContext'

export const useGISContext = () => {
  const context = useContext(GISContext)

  if (!context) {
    throw new Error(
      'useGISContext must be used within GISProvider'
    )
  }

  return context
}