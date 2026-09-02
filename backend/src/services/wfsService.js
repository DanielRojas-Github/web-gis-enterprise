import {
  RepositoryFactory,
} from "../repositories/RepositoryFactory.js";

import {
  geoserverService,
} from "./geoserverService.js";


const roadRepository =
  RepositoryFactory.getRepository(
    "road"
  );


export async function getRoads() {

  const [
    data,
    roads,
  ] =
    await Promise.all([
      geoserverService
        .getFeatures(
          "roads"
        ),

      roadRepository
        .findAll(),
    ]);


  const roadsById =
    new Map(
      roads.map(
        (road) => [
          Number(
            road.id
          ),
          road,
        ]
      )
    );


  return {
    type:
      "FeatureCollection",

    features:
      data.features.map(
        (feature) => {

          const rawId =
            feature.id;

          const id =
            Number(
              String(rawId)
                .split(".")
                .pop()
            );


          const road =
            roadsById.get(
              id
            );


          return {

            type:
              "Feature",

            id,

            properties: {

              id,

              name:
                feature.properties
                  ?.name ?? null,

              description:
                feature.properties
                  ?.description ?? null,

              lengthMeters:
                road
                  ? Number(
                    road.lengthMeters
                  )
                  : null,

            },

            geometry:
              feature.geometry,

          };

        }
      ),

  };

}


export async function getBuildings() {

  const buildingRepository =
    RepositoryFactory.getRepository(
      "building"
    );


  const [
    data,
    buildings,
  ] =
    await Promise.all([
      geoserverService
        .getFeatures(
          "buildings"
        ),

      buildingRepository
        .findAll(),
    ]);


  const buildingsById =
    new Map(
      buildings.map(
        (building) => [
          Number(
            building.id
          ),
          building,
        ]
      )
    );


  return {
    type:
      "FeatureCollection",

    features:
      data.features.map(
        (feature) => {

          const rawId =
            feature.id;

          const id =
            Number(
              String(rawId)
                .split(".")
                .pop()
            );


          const building =
            buildingsById.get(
              id
            );


          return {

            type:
              "Feature",

            id,

            properties: {

              id,

              name:
                feature.properties
                  ?.name ?? null,

              description:
                feature.properties
                  ?.description ?? null,

              areaSquareMeters:
                building
                  ? Number(
                    building.areaSquareMeters
                  )
                  : null,

              perimeterMeters:
                building
                  ? Number(
                    building.perimeterMeters
                  )
                  : null,

            },

            geometry:
              feature.geometry,

          };

        }
      ),

  };

}