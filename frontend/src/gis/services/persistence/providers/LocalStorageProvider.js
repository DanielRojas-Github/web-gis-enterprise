import {
  BaseStorageProvider,
} from './BaseStorageProvider'

export class LocalStorageProvider
  extends BaseStorageProvider {

  async create(
    key,
    data
  ) {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    )

  }

  async update(
    key,
    data
  ) {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    )

  }

  async delete(key) {

    localStorage.removeItem(
      key
    )

  }

  async load(key) {

    const data =
      localStorage.getItem(key)

    if (!data) {

      return null

    }

    return JSON.parse(data)

  }

}