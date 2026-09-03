import {
  RepositoryFactory,
} from "../repositories/RepositoryFactory.js";

import {
  geoserverService,
} from "./geoserverService.js";

import {
  buildGeoServerQuery,
  parsePropertyNames,
} from "../utils/wfsQuery.js";


const roadRepository =
  RepositoryFactory.getRepository(
    "road"
  );


export async function getRoads(
  query = {}
) {
 const requestedProperties =
  parsePropertyNames(
    query.propertyName
  );


const geoserverQuery =
  buildGeoServerQuery(
    query,
    [
      "id",
      "name",
      "description",
    ],
    [
      "id",
      "name",
      "description",
    ]
  );


  if (
    requestedProperties
  ) {

    const geoserverProperties =
      requestedProperties
        .filter(
          (property) =>
            [
              "id",
              "name",
              "description",
            ].includes(
              property
            )
        );


    if (
      !geoserverProperties.includes(
        "geom"
      )
    ) {

      geoserverProperties.push(
        "geom"
      );

    }


    geoserverQuery.propertyName =
      geoserverProperties.join(",");

  }
  const [
    data,
    roads,
  ] =
    await Promise.all([
      geoserverService
        .getFeatures(
          "roads",
          geoserverQuery
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

  ...(
    !requestedProperties ||
    requestedProperties.includes(
      "id"
    )
      ? {
          id,
        }
      : {}
  ),

  ...(
    !requestedProperties ||
    requestedProperties.includes(
      "name"
    )
      ? {
          name:
            feature.properties
              ?.name ?? null,
        }
      : {}
  ),

  ...(
    !requestedProperties ||
    requestedProperties.includes(
      "description"
    )
      ? {
          description:
            feature.properties
              ?.description ?? null,
        }
      : {}
  ),

  ...(
    !requestedProperties ||
    requestedProperties.includes(
      "lengthMeters"
    )
      ? {
          lengthMeters:
            road
              ? Number(
                road.lengthMeters
              )
              : null,
        }
      : {}
  ),

},

            geometry:
              feature.geometry,

          };

        }
      ),

  };

}


export async function getBuildings(
  query = {}
) {
const requestedProperties =
  parsePropertyNames(
    query.propertyName
  );


const geoserverQuery =
  buildGeoServerQuery(
    query,
    [
      "id",
      "name",
      "description",
    ],
    [
      "id",
      "name",
      "description",
    ]
  );
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
          "buildings",
          geoserverQuery
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

  ...(
    !requestedProperties ||
    requestedProperties.includes(
      "id"
    )
      ? {
          id,
        }
      : {}
  ),

  ...(
    !requestedProperties ||
    requestedProperties.includes(
      "name"
    )
      ? {
          name:
            feature.properties
              ?.name ?? null,
        }
      : {}
  ),

  ...(
    !requestedProperties ||
    requestedProperties.includes(
      "description"
    )
      ? {
          description:
            feature.properties
              ?.description ?? null,
        }
      : {}
  ),

  ...(
    !requestedProperties ||
    requestedProperties.includes(
      "areaSquareMeters"
    )
      ? {
          areaSquareMeters:
            building
              ? Number(
                  building.areaSquareMeters
                )
              : null,
        }
      : {}
  ),

  ...(
    !requestedProperties ||
    requestedProperties.includes(
      "perimeterMeters"
    )
      ? {
          perimeterMeters:
            building
              ? Number(
                  building.perimeterMeters
                )
              : null,
        }
      : {}
  ),

},

            geometry:
              feature.geometry,

          };

        }
      ),

  };

}