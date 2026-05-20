import { useReducer } from 'react'
import  { LayerContext } from './LayerContext.js'
import  { layerReducer }  from './layerReducer.js'
import  { layerInitialState }  from './layerInitialState.js'
const LayerProvider = ({//
  children,
}) => {
  const [state, dispatch] =
    useReducer(
      layerReducer,
      layerInitialState
    )

  return (
    <LayerContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </LayerContext.Provider>
  )
}

export default LayerProvider