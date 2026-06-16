import {
  useGIS,
}
from '@/store/gis/hooks/useGIS'

export default function
FeatureInspector() {

  const {
    state,
  } = useGIS()

  const {
    selectedFeature,
  } = state

  if (!selectedFeature) {

    return (

      <div className="feature-inspector">

        <h3>
          Feature Inspector
        </h3>

        <p>
          No feature selected
        </p>

      </div>
    )
  }

  return (

    <div className="feature-inspector">

      <h3>
        Feature Inspector
      </h3>

      {Object.entries(
        selectedFeature.properties || {}
      ).map(

        ([key, value]) => (

          <div key={key}>

            <strong>
              {key}
            </strong>

            {': '}

            {String(value)}

          </div>
        )
      )}

    </div>
  )
}