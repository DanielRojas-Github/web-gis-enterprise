export class BaseRepository {

  findAll() {
    throw new Error(
      "findAll() not implemented"
    );
  }

  findById(_id) {
    throw new Error(
      "findById() not implemented"
    );
  }

  create(_data) {
    throw new Error(
      "create() not implemented"
    );
  }

  update(_id, _data) {
    throw new Error(
      "update() not implemented"
    );
  }

  delete(_id) {
    throw new Error(
      "delete() not implemented"
    );
  }

}