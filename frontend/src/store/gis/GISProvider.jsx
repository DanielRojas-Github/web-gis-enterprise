import { useReducer } from 'react'

import { GISContext } from '../gis/gisContext.js'
import { gisReducer } from '../gis/gisReducer.js'
import { gisInitialState } from '../gis/gisInitialState.js'




const GISProvider = ({
  children,
}) => {
  const [state, dispatch] =
    useReducer(
      gisReducer,
      gisInitialState
    )
  
  return (
    <GISContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </GISContext.Provider>
  )
}

export default GISProvider