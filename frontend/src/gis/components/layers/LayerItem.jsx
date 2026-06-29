import { useLayers }
  from '@/store/layers/hooks/useLayers'

// import { LAYER_ACTIONS }
  // from '@/store/layers/layerActions'

import OpacitySlider
  from './OpacitySlider'

import LayerLegend
  from './LayerLegend'

const LayerItem = ({
  layer,
}) => {

  const {
  toggleLayer,
  setOpacity,
} = useLayers()

  const handleOpacityChange = (opacity) => {
    setOpacity(layer.id, opacity)
  }

  const handleToggleLayer = () => {
    toggleLayer(layer.id)
  }
const getLayerStatus = () => {
  if (layer.error) {
    return {
      icon: '⚠',
      title: layer.error,
    }
  }

  if (layer.saving) {
    return {
      icon: '⟳',
      title: 'Saving...',
    }
  }

  if (layer.dirty) {
    return {
      icon: '●',
      title: 'Unsaved changes',
    }
  }

  if (layer.lastSaved) {
    return {
      icon: '✓',
      title: `Saved`
    }
  }

  return null
}
const status =
  getLayerStatus()
  return (
    <div className="layer-item">

      <div className="layer-item-header">

        <input
          type="checkbox"
          checked={
            layer.visible
          }
          onChange={
            handleToggleLayer
          }
        />

      <div className="layer-status-container">

  <span>
    {layer.name}
  </span>

  {status && (
    <span
      title={status.title}
      className="layer-sync-status"
    >
      {status.icon}
    </span>
  )}

  {layer.lastSaved &&
    !layer.dirty &&
    !layer.saving && (
      <small
        className="layer-last-saved"
      >
        {new Date(
          layer.lastSaved
        ).toLocaleTimeString()
        }
      </small>
  )}

</div>

      </div>

      <OpacitySlider
        opacity={
          layer.opacity
        }
        onChange={
          handleOpacityChange
        }
      />

      <LayerLegend
        legendUrl={
          layer.legendUrl
        }
      />
    </div>
    
  )
}

export default LayerItem