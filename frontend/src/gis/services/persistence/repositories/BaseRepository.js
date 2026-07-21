export class BaseRepository {

  async create(data) {

    throw new Error(
      'create() not implemented'
    )

  }

  async update(data) {

    throw new Error(
      'update() not implemented'
    )

  }

  async find(id) {

    throw new Error(
      'find() not implemented'
    )

  }

  async findAll() {

    throw new Error(
      'findAll() not implemented'
    )

  }

  async delete(id) {

    throw new Error(
      'delete() not implemented'
    )

  }

}