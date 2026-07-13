export class BaseStorageProvider {

  async create(_key, _data) {

    throw new Error(
      'create() not implemented'
    )

  }

  async update(_key, _data) {

    throw new Error(
      'update() not implemented'
    )

  }

  async delete(_key) {

    throw new Error(
      'delete() not implemented'
    )

  }

  async load(_key) {

    throw new Error(
      'load() not implemented'
    )

  }

}