const STORAGE_KEY =
  'gis_features'

export function
saveFeatures(features) {
   

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(features)
  )
}

export function
loadFeatures() {

  const data =
    localStorage.getItem(
      STORAGE_KEY
    )

  if (!data) {

    return []
  }

  return JSON.parse(data)
}

export function
clearFeatures() {

  localStorage.removeItem(
    STORAGE_KEY
  )
}