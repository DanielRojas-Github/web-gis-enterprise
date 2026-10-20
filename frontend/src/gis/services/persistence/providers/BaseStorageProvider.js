export class BaseStorageProvider {

  async create(key, data) {

    void key
    void data

    throw new Error(
      'create() not implemented'
    )

  }

  async update(key, data) {

    void key
    void data

    throw new Error(
      'update() not implemented'
    )

  }

  async delete(key) {

    void key

    throw new Error(
      'delete() not implemented'
    )

  }

  async load(key) {

    void key

    throw new Error(
      'load() not implemented'
    )

  }

}