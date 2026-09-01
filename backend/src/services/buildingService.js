import {
  RepositoryFactory,
} from "../repositories/RepositoryFactory.js";


const buildingRepository =
  RepositoryFactory.getRepository(
    "building"
  );


export async function getBuildings() {

  const buildings =
    await buildingRepository.findAll();

  return {
    type: "FeatureCollection",

    features:
      buildings.map(
        (building) => ({
          type:
            "Feature",

          id:
            building.id,

          properties: {
            id:
              building.id,

            name:
              building.name,

            description:
              building.description,

            areaSquareMeters:
              Number(
                building.areaSquareMeters
              ),

            perimeterMeters:
              Number(
                building.perimeterMeters
              ),
          },

          geometry:
            building.geometry,
        })
      ),
  };

}