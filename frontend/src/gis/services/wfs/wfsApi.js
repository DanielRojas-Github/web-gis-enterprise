import api from '@/services/api/axios'

const WFS_ENDPOINT =
  '/api/wfs'

export const getWFSFeatures =
  async ({
    typeName,
    params = {},
    signal,
  }) => {

    const response =
      await api.get(
        `${WFS_ENDPOINT}/${typeName}`,
        {
          params,
          signal,
        }
      )

    return response.data
  }