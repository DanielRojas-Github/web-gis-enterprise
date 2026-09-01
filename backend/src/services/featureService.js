import {
  RepositoryFactory,
} from "../repositories/RepositoryFactory.js";

const featureRepository =
  RepositoryFactory.getRepository(
    "feature"
  );

export function getFeatures() {

  return featureRepository.findAll();

}