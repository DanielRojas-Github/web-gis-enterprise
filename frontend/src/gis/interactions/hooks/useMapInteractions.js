
import { useEffect, useRef } from 'react'
import { useMapEvents } from 'react-leaflet'
import { toolManager } from '@/gis/tools/manager/ToolManager'
import { useLayers } from '@/store/layers/hooks/useLayers'
import { useGIS } from '@/store/gis/hooks/useGIS'
import { findLayerById } from '@/gis/utils/findLayerById'
import {
  createPublicFacility,
  getPublicFacilityError,
} from '@/gis/services/publicFacilities/publicFacilitiesApi'
import { publicFacilityEditorState, publicFacilityEditorStore } from '@/gis/services/publicFacilities/publicFacilityEditorStore'

const DOUBLE_CLICK_DELAY = 250

export const useMapInteractions = () => {
  const clickTimeoutRef = useRef(null)
  const { layers, updateLayer } = useLayers()
  const { setSelectedFeature } = useGIS()

  const handleFacilityPlacement = async (event) => {
    if (!publicFacilityEditorState.placing || publicFacilityEditorState.saving) {
      return false
    }

    const { draft } = publicFacilityEditorState
    publicFacilityEditorStore.setState({ saving: true, feedback: '', error: false })

    try {
      const feature = await createPublicFacility({
        ...draft,
        geometry: {
          type: 'Point',
          coordinates: [event.latlng.lng, event.latlng.lat],
        },
      })
      const layer = findLayerById(layers, 'public-facilities')

      if (!layer) {
        throw new Error('La capa de equipamientos no está disponible.')
      }

      const currentFeatures = layer.source?.features?.features || []
      updateLayer('public-facilities', {
        featureRevision: (layer.featureRevision || 0) + 1,
        source: {
          ...layer.source,
          features: {
            type: 'FeatureCollection',
            features: [...currentFeatures, feature],
          },
        },
        visible: true,
        loading: false,
        error: null,
      })
      setSelectedFeature({
        ...feature,
        layerId: 'public-facilities',
        layerName: 'Public Facilities',
      })
      publicFacilityEditorStore.setState({
        placing: false,
        saving: false,
        feedback: 'Equipamiento guardado en PostGIS.',
        error: false,
      })
    } catch (error) {
      publicFacilityEditorStore.setState({
        placing: false,
        saving: false,
        feedback: getPublicFacilityError(error),
        error: true,
      })
    }

    return true
  }

  const map = useMapEvents({
    async click(event) {
      if (publicFacilityEditorState.placing) {
        await handleFacilityPlacement(event)
        return
      }

      const activeTool = toolManager.getActiveTool()

      if (!activeTool?.onMapClick) {
        return
      }

      // Point y otras herramientas procesan el clic inmediatamente.
      // Para DrawTool esperamos un momento para detectar un doble clic.
      if (activeTool.id !== 'draw') {
        activeTool.onMapClick(event)
        return
      }

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }

      clickTimeoutRef.current = setTimeout(() => {
        const currentTool = toolManager.getActiveTool()

        if (currentTool?.id === 'draw' && currentTool.onMapClick) {
          currentTool.onMapClick(event)
        }

        clickTimeoutRef.current = null
      }, DOUBLE_CLICK_DELAY)
    },

    dblclick(event) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
        clickTimeoutRef.current = null
      }

      const activeTool = toolManager.getActiveTool()

      if (activeTool?.id === 'draw' && activeTool.onDoubleClick) {
        activeTool.onDoubleClick(event)
      }
    },
  })

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [map])

  return null
}
