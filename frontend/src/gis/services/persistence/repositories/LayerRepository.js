import { BaseRepository }
  from './BaseRepository'

import {
  saveLayerState,
  loadLayerState,
  clearLayerState,
} from '../layerPersistence'

export class LayerRepository
  extends BaseRepository {

  async create(layer) {

    console.log(
      'CREATE LAYER'
    )

    return true

  }

  async update(layer) {

    console.log(
      'UPDATE LAYER'
    )

    saveLayerState(layer)

    return true

  }

  async find(id) {

    console.log(
      'FIND LAYER',
      id
    )

  }

  async findAll() {

    console.log(
      'LOAD LAYERS'
    )

    return loadLayerState()

  }

  async delete(id) {

    console.log(
      'DELETE LAYER',
      id
    )

    clearLayerState()

    return true

  }

}