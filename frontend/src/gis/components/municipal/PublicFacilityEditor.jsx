import { useEffect, useState } from 'react'

import {
  useGIS,
} from '@/store/gis/hooks/useGIS'

import {
  useLayers,
} from '@/store/layers/hooks/useLayers'

import {
  findLayerById,
} from '@/gis/utils/findLayerById'

import {
  deletePublicFacility,
  getPublicFacilityError,
  updatePublicFacility,
} from '@/gis/services/publicFacilities/publicFacilitiesApi'

import api from '@/services/api/axios'

import {
  publicFacilityEditorState,
  publicFacilityEditorStore,
} from '@/gis/services/publicFacilities/publicFacilityEditorStore'

const emptyForm = {
  name: '',
  facilityType: 'other',
  status: 'active',
  managingDepartment: '',
}

const getFeatureForm = (feature) => ({
  name: feature.properties?.name || '',
  facilityType: feature.properties?.facilityType || 'other',
  status: feature.properties?.status || 'active',
  managingDepartment: feature.properties?.managingDepartment || '',
})

const isPublicFacility = (feature) =>
  feature?.layerId === 'public-facilities'

export default function PublicFacilityEditor() {
  const [formState, setFormState] = useState({
    featureId: null,
    value: emptyForm,
  })
  const [, refresh] = useState(0)
  const [canWrite, setCanWrite] = useState(false)
  const [permissionsLoaded, setPermissionsLoaded] = useState(false)
  const { state, setSelectedFeature } = useGIS()
  const { layers, updateLayer } = useLayers()
  const selectedFeature = isPublicFacility(state.selectedFeature)
    ? state.selectedFeature
    : null
  const form = selectedFeature
    ? formState.featureId === selectedFeature.id
      ? formState.value
      : getFeatureForm(selectedFeature)
    : formState.featureId === null
      ? formState.value
      : emptyForm

  useEffect(() => publicFacilityEditorStore.subscribe(() => {
    refresh((value) => value + 1)
  }), [])

  useEffect(() => {
    let cancelled = false

    api.get('/auth/me')
      .then((response) => {
        if (!cancelled) {
          setCanWrite(response.data?.user?.permissions?.canWrite === true)
          setPermissionsLoaded(true)
        }
      })
      .catch(() => {
        if (!cancelled) setPermissionsLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const setFormField = (key, value) => {
    const currentValue = selectedFeature && formState.featureId !== selectedFeature.id
      ? getFeatureForm(selectedFeature)
      : form

    setFormState({
      featureId: selectedFeature?.id ?? null,
      value: {
        ...currentValue,
        [key]: value,
      },
    })
  }

  const resetForm = () => setFormState({
    featureId: null,
    value: emptyForm,
  })

  const updateLayerFeatures = (features) => {
    const layer = findLayerById(layers, 'public-facilities')

    if (!layer) {
      throw new Error('La capa de equipamientos no está disponible.')
    }

    updateLayer('public-facilities', {
      featureRevision: (layer.featureRevision || 0) + 1,
      source: {
        ...layer.source,
        features: {
          type: 'FeatureCollection',
          features,
        },
      },
      visible: true,
      loading: false,
      error: null,
    })
  }

  const handlePlace = (event) => {
    event.preventDefault()

    publicFacilityEditorStore.setState({
      draft: {
        ...form,
        name: form.name.trim(),
        managingDepartment: form.managingDepartment.trim() || null,
      },
      placing: true,
      feedback: 'Haz clic en el mapa para guardar el equipamiento.',
      error: false,
    })
  }

  const handleCancelPlacement = () => {
    publicFacilityEditorStore.setState({
      placing: false,
      draft: null,
      feedback: 'Ubicación cancelada.',
      error: false,
    })
  }

  const handleUpdate = async () => {
    if (!selectedFeature) return

    publicFacilityEditorStore.setState({ saving: true, feedback: '', error: false })

    try {
      const updated = await updatePublicFacility(selectedFeature.id, {
        ...form,
        name: form.name.trim(),
        managingDepartment: form.managingDepartment.trim() || null,
        geometry: selectedFeature.geometry,
      })
      const current = findLayerById(layers, 'public-facilities')
      const features = current?.source?.features?.features || []

      updateLayerFeatures(features.map((feature) => (
        String(feature.id) === String(updated.id) ? updated : feature
      )))
      setSelectedFeature({
        ...updated,
        layerId: 'public-facilities',
        layerName: 'Public Facilities',
      })
      publicFacilityEditorStore.setState({
        saving: false,
        feedback: 'Equipamiento actualizado.',
        error: false,
      })
    } catch (error) {
      publicFacilityEditorStore.setState({
        saving: false,
        feedback: getPublicFacilityError(error),
        error: true,
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedFeature) return
    if (!window.confirm('¿Eliminar este equipamiento público?')) return

    publicFacilityEditorStore.setState({ saving: true, feedback: '', error: false })

    try {
      await deletePublicFacility(selectedFeature.id)
      const current = findLayerById(layers, 'public-facilities')
      const features = current?.source?.features?.features || []

      updateLayerFeatures(features.filter((feature) => (
        String(feature.id) !== String(selectedFeature.id)
      )))
      setSelectedFeature(null)
      resetForm()
      publicFacilityEditorStore.setState({
        saving: false,
        feedback: 'Equipamiento eliminado.',
        error: false,
      })
    } catch (error) {
      publicFacilityEditorStore.setState({
        saving: false,
        feedback: getPublicFacilityError(error),
        error: true,
      })
    }
  }

  const saving = publicFacilityEditorState.saving

  return (
    <section className="municipal-facility-editor" aria-labelledby="facility-editor-title">
      <h3 id="facility-editor-title">Equipamientos públicos</h3>
      <p>
        {selectedFeature
          ? `Editando equipamiento #${selectedFeature.id}`
          : 'Registra escuelas, centros de salud y otros servicios municipales.'}
      </p>

      {!canWrite && permissionsLoaded && (
        <p>Tu rol permite consultar la capa, pero no editar equipamientos.</p>
      )}

      <form onSubmit={handlePlace}>
        <label>
          Nombre
          <input
            required
            maxLength={160}
            disabled={!canWrite || saving}
            value={form.name}
            onChange={(event) => setFormField('name', event.target.value)}
          />
        </label>

        <label>
          Tipo
          <select
            disabled={!canWrite || saving}
            value={form.facilityType}
            onChange={(event) => setFormField('facilityType', event.target.value)}
          >
            <option value="school">Escuela</option>
            <option value="health_center">Centro de salud</option>
            <option value="municipal_office">Oficina municipal</option>
            <option value="community_center">Centro comunitario</option>
            <option value="sports_center">Centro deportivo</option>
            <option value="library">Biblioteca</option>
            <option value="other">Otro</option>
          </select>
        </label>

        <label>
          Estado
          <select
            disabled={!canWrite || saving}
            value={form.status}
            onChange={(event) => setFormField('status', event.target.value)}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="under_maintenance">En mantenimiento</option>
          </select>
        </label>

        <label>
          Área municipal responsable
          <input
            maxLength={120}
            disabled={!canWrite || saving}
            value={form.managingDepartment}
            onChange={(event) => setFormField('managingDepartment', event.target.value)}
          />
        </label>

        {selectedFeature && canWrite ? (
          <div className="municipal-facility-actions">
            <button type="button" disabled={saving} onClick={handleUpdate}>
              Guardar cambios
            </button>
            <button type="button" disabled={saving} onClick={handleDelete}>
              Eliminar
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setSelectedFeature(null)
                resetForm()
              }}
            >
              Cancelar
            </button>
          </div>
        ) : !selectedFeature && canWrite ? (
          <div className="municipal-facility-actions">
            <button type="submit" disabled={saving}>
              Ubicar en el mapa
            </button>
            {publicFacilityEditorState.placing && (
              <button type="button" disabled={saving} onClick={handleCancelPlacement}>
                Cancelar ubicación
              </button>
            )}
          </div>
        ) : null}

        {!permissionsLoaded && (
          <p role="status">Comprobando permisos de edición…</p>
        )}
      </form>

      {publicFacilityEditorState.feedback && (
        <p role="status" aria-live="polite" className={publicFacilityEditorState.error ? 'error' : ''}>
          {publicFacilityEditorState.feedback}
        </p>
      )}
    </section>
  )
}
