import { useGIS }
from '@/store/gis/hooks/useGIS'

export default function SelectionRenderer() {

  const { state } =
    useGIS()

  const feature =
    state.selectedFeature

  if (!feature) {
    return null
  }
 console.log(
  'Selected Feature:',
  feature
)
  const vertexCount =
    feature.points?.length ?? 0

  return (

    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,

        background: 'white',

        padding: '12px',

        borderRadius: '8px',

        boxShadow:
          '0 2px 10px rgba(0,0,0,.2)',

        minWidth: '250px',
      }}
    >

      <h4>
        Feature Seleccionada
      </h4>

      <p>
        <strong>ID:</strong>
        {' '}
        {feature.id}
      </p>

      <p>
        <strong>Tipo:</strong>
        {' '}
        {feature.type}
      </p>

      <p>
        <strong>Vértices:</strong>
        {' '}
        {vertexCount}
      </p>

    </div>
  )
}