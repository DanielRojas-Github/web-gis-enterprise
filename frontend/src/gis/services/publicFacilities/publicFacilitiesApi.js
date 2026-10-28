import api from '@/services/api/axios'

const ENDPOINT = '/public-facilities'

const unwrap = (response) => {
  if (!response.data?.success) {
    throw new Error('The municipal facilities request failed.')
  }

  return response.data.data
}

export const getPublicFacilities = async () =>
  unwrap(await api.get(ENDPOINT))

export const createPublicFacility = async (facility) =>
  unwrap(await api.post(ENDPOINT, facility))

export const updatePublicFacility = async (id, facility) =>
  unwrap(await api.put(`${ENDPOINT}/${id}`, facility))

export const deletePublicFacility = async (id) =>
  unwrap(await api.delete(`${ENDPOINT}/${id}`))

export const getPublicFacilityError = (error) => (
  error.response?.data?.error?.message ||
  error.message ||
  'No se pudo completar la operación.'
)
