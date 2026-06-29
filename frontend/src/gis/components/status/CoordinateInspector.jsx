import { useGIS }
  from '@/store/gis/hooks/useGIS'

const CoordinateInspector = () => {

  const {
    state,
  } = useGIS()

  const featureInfo =
    state.featureInfo

  return (
    <div
      style={{
        position: 'absolute',

        bottom: 200,
        left: 400,

        zIndex: 9999,

        background: '#FFFFFF',

        padding: '10px',

        borderRadius: '8px',

        boxShadow:
          '0 2px 10px rgba(0,0,0,0.2)',
      }}
    >

      <h4>
        Coordinate Inspector
      </h4>

      {featureInfo ? (
        <div>

          <p>
            Lat:
            {' '}
            {featureInfo.lat.toFixed(6)}
          </p>

          <p>
            Lng:
            {' '}
            {featureInfo.lng.toFixed(6)}
          </p>

        </div>
      ) : (
        <p>
          Click on map
        </p>
      )}

    </div>
  )
}

export default CoordinateInspector