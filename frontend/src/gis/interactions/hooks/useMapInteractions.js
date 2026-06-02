import { useMapEvents }
from 'react-leaflet'

export const useMapInteractions = () => {

  useMapEvents({

    click(event) {

      const { latlng } = event

      console.log(
        'Map clicked:',
        latlng
      )
    },
  })

  return null
}