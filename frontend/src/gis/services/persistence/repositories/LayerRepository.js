import { BaseRepository }
  from './BaseRepository'

import {
  LocalStorageProvider,
} from '../providers/LocalStorageProvider'

const STORAGE_KEY =
  'gis-layer-state'

export class LayerRepository
  extends BaseRepository {

  constructor() {

    super()

    this.provider =
      new LocalStorageProvider()

  }

  async create(layer) {

    console.log(
      'CREATE LAYER'
    )

    await this.provider.create(
      STORAGE_KEY,
      layer
    )

    return true

  }

  async update(layer) {

    console.log(
      'UPDATE LAYER'
    )

    await this.provider.update(
      STORAGE_KEY,
      layer
    )

    return true

  }

  async find(id) {

    console.log(
      'FIND LAYER',
      id
    )

    return await this.provider.load(
      STORAGE_KEY
    )

  }

  async findAll() {

    console.log(
      'LOAD LAYERS'
    )

    return await this.provider.load(
      STORAGE_KEY
    )

  }

  async delete(id) {

    console.log(
      'DELETE LAYER',
      id
    )

    await this.provider.delete(
      STORAGE_KEY
    )

    return true

  }

}