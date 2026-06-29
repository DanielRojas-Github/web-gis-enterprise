import { useGIS }
  from '@/store/gis/hooks/useGIS'

export default function DynamicAttributeEditor() {

  const {
    state,
    setEditingFeature,
  } = useGIS()

  const feature =
    state.editingFeature

  if (!feature) {
    return null
  }

  const handleChange = (
    key,
    value
  ) => {

    const updatedFeature = {

      ...feature,

      properties: {

        ...feature.properties,

        [key]: value,
      },
    }

    setEditingFeature(
      updatedFeature
    )
  }

  return (

    <div
      style={{
        padding: '10px',
        border: '1px solid #ddd',
      }}
    >

      <h4>
        Attribute Editor
      </h4>

      {Object.keys(
        feature.properties || {}
      ).length === 0 && (

        <p>
          No attributes to edit
        </p>

      )}

      {Object.entries(
        feature.properties || {}
      ).map(([key, value]) => (

        <div
          key={key}
          style={{
            marginBottom: '8px',
          }}
        >

          <label>
            {key}
          </label>

          <input
            style={{
              marginLeft: '10px',
            }}
            value={value}
            onChange={(e) =>
              handleChange(
                key,
                e.target.value
              )
            }
          />

        </div>

      ))}

    </div>
  )
}