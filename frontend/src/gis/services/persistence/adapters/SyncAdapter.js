export class SyncAdapter {

  async create(operation) {

    throw new Error(
      `${this.constructor.name}.create() not implemented`
    )

  }

  async update(operation) {

    throw new Error(
      `${this.constructor.name}.update() not implemented`
    )

  }

  async delete(operation) {

    throw new Error(
      `${this.constructor.name}.delete() not implemented`
    )

  }

}