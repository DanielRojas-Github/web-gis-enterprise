
import { BaseRepository } from './BaseRepository'
import { LocalStorageProvider } from '../providers/LocalStorageProvider'

const STORAGE_KEY = 'gis-layer-state'
const STORAGE_VERSION = 1

export class LayerRepository extends BaseRepository {
  constructor() {
    super()
    this.provider = new LocalStorageProvider()
  }

  async readState() {
    const storedState = await this.provider.load(STORAGE_KEY)

    if (storedState === null) {
      return {
        version: STORAGE_VERSION,
        layers: [],
      }
    }

    if (
      !storedState ||
      storedState.version !== STORAGE_VERSION ||
      !Array.isArray(storedState.layers)
    ) {
      throw new Error(
        'Invalid persisted layer state. Stored data was not modified.'
      )
    }

    return storedState
  }

  async writeState(state) {
    await this.provider.update(STORAGE_KEY, state)
  }

  async create(layer) {
    if (!layer?.id) {
      throw new Error('Cannot create a layer without an id.')
    }

    const state = await this.readState()

    const exists = state.layers.some(
      (item) => item.id === layer.id
    )

    if (exists) {
      throw new Error(
        `Cannot create layer "${layer.id}": id already exists.`
      )
    }

    const nextState = {
      ...state,
      layers: [...state.layers, layer],
    }

    await this.writeState(nextState)

    return true
  }

  async update(layer) {
    if (!layer?.id) {
      throw new Error('Cannot update a layer without an id.')
    }

    const state = await this.readState()

    const index = state.layers.findIndex(
      (item) => item.id === layer.id
    )

    if (index === -1) {
      throw new Error(
        `Cannot update layer "${layer.id}": layer not found.`
      )
    }

    const layers = [...state.layers]
    layers[index] = layer

    await this.writeState({
      ...state,
      layers,
    })

    return true
  }

  async find(id) {
    if (!id) {
      return null
    }

    const state = await this.readState()

    return state.layers.find(
      (layer) => layer.id === id
    ) ?? null
  }

  async findAll() {
    const state = await this.readState()

    return [...state.layers]
  }

  async delete(id) {
    if (!id) {
      throw new Error('Cannot delete a layer without an id.')
    }

    const state = await this.readState()

    const layers = state.layers.filter(
      (layer) => layer.id !== id
    )

    if (layers.length === state.layers.length) {
      throw new Error(
        `Cannot delete layer "${id}": layer not found.`
      )
    }

    await this.writeState({
      ...state,
      layers,
    })

    return true
  }
}
