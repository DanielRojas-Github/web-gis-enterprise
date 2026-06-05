// src/gis/import/components/WFSLoadButton.jsx

import {
  loadWFSFeatures,
}
from '@/gis/services/wfs/wfsFeatureService'//frontend\src\gis\services\wfs\wfsFeatureService.js

export default function
WFSLoadButton() {

  const handleClick =
    async () => {

      try {

        const features =

          await loadWFSFeatures(
            'http://localhost:3000/api/wfs/roads'
          )

        console.log(
          'WFS IMPORTADO',
          features
        )

      } catch (error) {

        console.error(error)
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