// import { Polyline } from 'react-leaflet'

// import { measureState } from './measureStore' //frontend\src\gis\tools\overlays\measure\measureStore.js

// export default function MeasureOverlay() {

//   if (measureState.points.length < 2) {
//     return null
//   }

//   return (
//     <Polyline positions={measureState.points} />
//   )

// } anteriormente se importaba el estado de medición directamente desde el store, pero ahora se debe usar el hook useMeasure para acceder al estado de medición de forma reactiva y mantener la consistencia con el resto de la aplicación.
console.log(measureState)
import { useEffect, useState } from 'react'

import { Polyline } from 'react-leaflet'

import { measureState } from './measureStore.js' //frontend\src\gis\tools\overlays\measure\measureStore.js

export default function MeasureOverlay() {
  
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    return measureState.subscribe(() => {
      forceUpdate((v) => v + 1)
      
    })
  }, [])

  if (measureState.points.length < 2) {
    return null
  }

  return (
   
    <Polyline positions={measureState.points} />
  )
}
