
class RepositoryFactory {

  constructor() {

    this.repositories = {}

  }

  register(
    type,
    repository
  ) {

    this.repositories[type] =
      repository

  }

  getRepository(type) {

    const repository =
      this.repositories[type]

    if (!repository) {

      throw new Error(
        `Repository "${type}" not found`
      )

    }

    return repository

  }

}


export const repositoryFactory =
  new RepositoryFactory()