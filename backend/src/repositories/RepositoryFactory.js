import {
  FeatureRepository,
} from "./featureRepository.js";

import {
  RoadRepository,
} from "./roadRepository.js";

import {
  BuildingRepository,
} from "./buildingRepository.js";

const repositories = {

  feature:
    new FeatureRepository(),

  road:
    new RoadRepository(),
  
  building:
    new BuildingRepository(),

};

export class RepositoryFactory {

  static getRepository(
    name
  ) {

    const repository =
      repositories[name];

    if (!repository) {

      throw new Error(
        `Repository "${name}" not found`
      );

    }

    return repository;
  }

}