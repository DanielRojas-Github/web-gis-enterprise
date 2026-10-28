import {
  RepositoryFactory,
} from "../repositories/RepositoryFactory.js";

import {
  AppError,
} from "../errors/AppError.js";

const publicFacilityRepository =
  RepositoryFactory.getRepository("publicFacility");

export async function getPublicFacilities() {
  const facilities = await publicFacilityRepository.findAll();

  return {
    type: "FeatureCollection",
    features: facilities.map((facility) => ({
      type: "Feature",
      id: facility.id,
      properties: {
        id: facility.id,
        name: facility.name,
        facilityType: facility.facilityType,
        status: facility.status,
        managingDepartment: facility.managingDepartment,
      },
      geometry: facility.geometry,
    })),
  };
}

const toFeature = (facility) => ({
  type: "Feature",
  id: facility.id,
  properties: {
    id: facility.id,
    name: facility.name,
    facilityType: facility.facilityType,
    status: facility.status,
    managingDepartment: facility.managingDepartment,
  },
  geometry: facility.geometry,
});

export async function createPublicFacility(input) {
  return toFeature(await publicFacilityRepository.create(input));
}

export async function updatePublicFacility(id, input) {
  const facility = await publicFacilityRepository.update(id, input);

  if (!facility) {
    throw new AppError("Public facility not found", 404, "PUBLIC_FACILITY_NOT_FOUND");
  }

  return toFeature(facility);
}

export async function deletePublicFacility(id) {
  const facility = await publicFacilityRepository.delete(id);

  if (!facility) {
    throw new AppError("Public facility not found", 404, "PUBLIC_FACILITY_NOT_FOUND");
  }

  return { id: facility.id };
}
