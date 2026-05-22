import { GeoJSON }
  from 'react-leaflet'

const SelectionRenderer = ({
  feature,
}) => {

  if (!feature) {
    return null
  }

  return (
    <GeoJSON
      data={feature}

      style={{
        color: '#00FFFF',
        weight: 3,
        fillOpacity: 0.2,
      }}
    />
  )
}

export default SelectionRenderer