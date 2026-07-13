export class BaseRepository {

  async save(data) {
    throw new Error(
      'save() not implemented'
    )
  }

  async load() {
    throw new Error(
      'load() not implemented'
    )
  }

  async delete(id) {
    throw new Error(
      'delete() not implemented'
    )
  }

}