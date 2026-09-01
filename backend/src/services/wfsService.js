import {
  RepositoryFactory,
} from "../repositories/RepositoryFactory.js";


const roadRepository =
  RepositoryFactory.getRepository(
    "road"
  );


export async function getRoads() {

  const roads =
    await roadRepository.findAll();

  return {
    type:
      "FeatureCollection",

    features:
      roads.map(
        (road) => ({

          type:
            "Feature",

          id:
            road.id,

          properties: {

            id:
              road.id,

            name:
              road.name,

            description:
              road.description,

            lengthMeters:
              Number(
                road.lengthMeters
              ),

          },

          geometry:
            road.geometry,

        })
      ),

  };

}