import { useState } from 'react'

function useMap() {
  const [zoom, setZoom] = useState(13)

  const zoomIn = () => {
    setZoom((prev) => prev + 1)
  }

  const zoomOut = () => {
    setZoom((prev) => prev - 1)
  }

  return {
    zoom,
    zoomIn,
    zoomOut,
  }
}

export default useMap