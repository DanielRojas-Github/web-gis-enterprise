const FACILITY_TYPES = new Set([
  "school",
  "health_center",
  "municipal_office",
  "community_center",
  "sports_center",
  "library",
  "other",
]);

const FACILITY_STATUSES = new Set([
  "active",
  "inactive",
  "under_maintenance",
]);

const ALLOWED_FIELDS = new Set([
  "name",
  "facilityType",
  "status",
  "managingDepartment",
  "geometry",
]);

export function validatePublicFacilityBody(request) {
  const body = request.body;
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return ["body must be an object"];
  }

  for (const key of Object.keys(body)) {
    if (!ALLOWED_FIELDS.has(key)) {
      errors.push(`Unsupported field: ${key}`);
    }
  }

  if (typeof body.name !== "string" || !body.name.trim() || body.name.length > 160) {
    errors.push("name must be a non-empty string up to 160 characters");
  }

  if (!FACILITY_TYPES.has(body.facilityType)) {
    errors.push("facilityType is not supported");
  }

  if (body.status !== undefined && !FACILITY_STATUSES.has(body.status)) {
    errors.push("status is not supported");
  }

  if (
    body.managingDepartment !== undefined &&
    body.managingDepartment !== null &&
    (typeof body.managingDepartment !== "string" ||
      body.managingDepartment.length > 120)
  ) {
    errors.push("managingDepartment must be a string up to 120 characters");
  }

  const geometry = body.geometry;
  const coordinates = geometry?.coordinates;
  const geometryFields = geometry && typeof geometry === "object"
    ? Object.keys(geometry)
    : [];

  if (
    geometry?.type !== "Point" ||
    geometryFields.some((field) => !["type", "coordinates"].includes(field)) ||
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    !coordinates.every(Number.isFinite) ||
    coordinates[0] < -180 || coordinates[0] > 180 ||
    coordinates[1] < -90 || coordinates[1] > 90
  ) {
    errors.push("geometry must be a valid EPSG:4326 Point [longitude, latitude]");
  }

  return errors;
}

export function validatePublicFacilityId(request) {
  const id = Number(request.params.id);
  return Number.isSafeInteger(id) && id > 0
    ? []
    : ["id must be a positive integer"];
}
