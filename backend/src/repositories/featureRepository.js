import {
  sampleGeoJSON,
} from "../data/sampleGeoJSON.js";

import {
  BaseRepository,
} from "./BaseRepository.js";

export class FeatureRepository
  extends BaseRepository {

  findAll() {
    return sampleGeoJSON;
  }

}