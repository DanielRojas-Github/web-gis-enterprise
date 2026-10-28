import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { once } from "node:events";
import express from "express";

import {
  errorHandler,
} from "../src/middleware/errorHandler.js";

import {
  requireGISReadRole,
} from "../src/middleware/requireGISReadRole.js";

import {
  RepositoryFactory,
} from "../src/repositories/RepositoryFactory.js";

import authRoutes
  from "../src/routes/authRoutes.js";

import publicFacilityRoutes
  from "../src/routes/publicFacilityRoutes.js";

const TEST_ORIGIN = "http://test.local";
const repository = RepositoryFactory.getRepository("publicFacility");
const originalRepositoryMethods = {
  findAll: repository.findAll,
  create: repository.create,
  update: repository.update,
  delete: repository.delete,
};

const app = express();
const facilities = new Map();
let nextId = 1;
let server;
let baseUrl;

const copyFacility = (facility) => structuredClone(facility);

const toRow = (facility) => ({
  id: facility.id,
  name: facility.name,
  facilityType: facility.facilityType,
  status: facility.status,
  managingDepartment: facility.managingDepartment,
  geometry: copyFacility(facility.geometry),
});

const resetFacilities = () => {
  facilities.clear();
  nextId = 1;
};

const request = (path, {
  roles = "gis-reader",
  origin = TEST_ORIGIN,
  ...options
} = {}) => {
  const headers = new Headers(options.headers || {});

  if (roles !== null) {
    headers.set("x-test-roles", roles);
  }

  if (origin !== null) {
    headers.set("origin", origin);
  }

  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });
};

const requestAuthMe = (roles) => fetch(
  `${baseUrl.replace("/api/public-facilities", "")}/api/auth/me`,
  {
    headers: {
      "x-test-roles": roles,
    },
  }
);

const facilityPayload = (overrides = {}) => ({
  name: "Biblioteca municipal de prueba",
  facilityType: "library",
  status: "active",
  managingDepartment: "Cultura",
  geometry: {
    type: "Point",
    coordinates: [-64.7296, -21.5355],
  },
  ...overrides,
});

app.use(express.json());
app.use("/api/auth", (request_, response, next) => {
  request_.session = {
    user: {
      issuer: "https://identity.test/realms/web-gis",
      subject: "test-user",
      roles: (request_.get("x-test-roles") || "gis-reader").split(","),
    },
  };
  next();
}, authRoutes);
app.use((request_, response, next) => {
  request_.authenticatedUser = {
    roles: (request_.get("x-test-roles") || "gis-reader")
      .split(",")
      .map((role) => role.trim()),
  };
  next();
});
app.use(
  "/api/public-facilities",
  requireGISReadRole,
  publicFacilityRoutes
);
app.use(errorHandler);

describe("Public facilities API", () => {
  before(async () => {
    repository.findAll = async () =>
      [...facilities.values()]
        .map(toRow)
        .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id);

    repository.create = async (input) => {
      const facility = {
        id: nextId++,
        name: input.name.trim(),
        facilityType: input.facilityType,
        status: input.status ?? "active",
        managingDepartment: input.managingDepartment?.trim() || null,
        geometry: copyFacility(input.geometry),
      };
      facilities.set(facility.id, facility);
      return toRow(facility);
    };

    repository.update = async (id, input) => {
      if (!facilities.has(id)) return null;

      const facility = {
        id,
        name: input.name.trim(),
        facilityType: input.facilityType,
        status: input.status ?? "active",
        managingDepartment: input.managingDepartment?.trim() || null,
        geometry: copyFacility(input.geometry),
      };
      facilities.set(id, facility);
      return toRow(facility);
    };

    repository.delete = async (id) => {
      if (!facilities.delete(id)) return null;
      return { id };
    };

    server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    baseUrl = `http://127.0.0.1:${server.address().port}/api/public-facilities`;
  });

  beforeEach(resetFacilities);

  after(async () => {
    if (server?.listening) {
      server.close();
      await once(server, "close");
    }

    Object.assign(repository, originalRepositoryMethods);
  });

  it("allows GIS readers to list a GeoJSON FeatureCollection", async () => {
    const response = await request("/");
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.type, "FeatureCollection");
    assert.deepEqual(body.data.features, []);
  });

  it("reports read and write permissions from configured GIS roles", async () => {
    const readerResponse = await requestAuthMe("gis-reader");
    const editorResponse = await requestAuthMe("gis-editor");
    const adminResponse = await requestAuthMe("gis-admin");
    const reader = await readerResponse.json();
    const editor = await editorResponse.json();
    const admin = await adminResponse.json();

    assert.equal(reader.user.permissions.canRead, true);
    assert.equal(reader.user.permissions.canWrite, false);
    assert.equal(editor.user.permissions.canRead, true);
    assert.equal(editor.user.permissions.canWrite, true);
    assert.equal(admin.user.permissions.canRead, true);
    assert.equal(admin.user.permissions.canWrite, true);
  });

  it("denies writes to gis-reader", async () => {
    const response = await request("/", {
      method: "POST",
      roles: "gis-reader",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(facilityPayload()),
    });
    const body = await response.json();

    assert.equal(response.status, 403);
    assert.equal(body.error.code, "GIS_WRITE_ROLE_REQUIRED");
    assert.equal(facilities.size, 0);
  });

  it("requires a configured Origin for writes", async () => {
    const response = await request("/", {
      method: "POST",
      roles: "gis-editor",
      origin: null,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(facilityPayload()),
    });
    const body = await response.json();

    assert.equal(response.status, 403);
    assert.equal(body.error.code, "UNTRUSTED_ORIGIN");
    assert.equal(facilities.size, 0);
  });

  it("rejects unsupported fields, categories, and invalid coordinates", async () => {
    const baseOptions = {
      method: "POST",
      roles: "gis-editor",
      headers: { "content-type": "application/json" },
    };
    const unsupportedField = await request("/", {
      ...baseOptions,
      body: JSON.stringify(facilityPayload({ ownerName: "Not allowed" })),
    });
    const unsupportedCategory = await request("/", {
      ...baseOptions,
      body: JSON.stringify(facilityPayload({ facilityType: "residence" })),
    });
    const invalidCoordinates = await request("/", {
      ...baseOptions,
      body: JSON.stringify(facilityPayload({
        geometry: { type: "Point", coordinates: [181, 0] },
      })),
    });

    assert.equal(unsupportedField.status, 400);
    assert.equal(unsupportedCategory.status, 400);
    assert.equal(invalidCoordinates.status, 400);
    assert.equal(facilities.size, 0);
  });

  it("creates and reads back a facility for gis-editor", async () => {
    const response = await request("/", {
      method: "POST",
      roles: "gis-editor",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(facilityPayload()),
    });
    const created = await response.json();
    const listResponse = await request("/");
    const listed = await listResponse.json();

    assert.equal(response.status, 201);
    assert.equal(created.data.type, "Feature");
    assert.equal(created.data.geometry.type, "Point");
    assert.equal(listResponse.status, 200);
    assert.equal(listed.data.features.length, 1);
    assert.equal(listed.data.features[0].properties.name, "Biblioteca municipal de prueba");
  });

  it("updates a facility and returns 404 for an unknown id", async () => {
    const createdResponse = await request("/", {
      method: "POST",
      roles: "gis-editor",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(facilityPayload()),
    });
    const created = await createdResponse.json();
    const updatedPayload = facilityPayload({
      name: "Biblioteca actualizada",
      status: "under_maintenance",
      geometry: { type: "Point", coordinates: [-64.72, -21.53] },
    });
    const updatedResponse = await request(`/${created.data.id}`, {
      method: "PUT",
      roles: "gis-editor",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(updatedPayload),
    });
    const updated = await updatedResponse.json();
    const missingResponse = await request("/999", {
      method: "PUT",
      roles: "gis-editor",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(updatedPayload),
    });

    assert.equal(updatedResponse.status, 200);
    assert.equal(updated.data.properties.name, "Biblioteca actualizada");
    assert.deepEqual(updated.data.geometry.coordinates, [-64.72, -21.53]);
    assert.equal(missingResponse.status, 404);
    assert.equal((await missingResponse.json()).error.code, "PUBLIC_FACILITY_NOT_FOUND");
  });

  it("allows gis-admin to delete and confirms the entity is gone", async () => {
    const createdResponse = await request("/", {
      method: "POST",
      roles: "gis-editor",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(facilityPayload()),
    });
    const created = await createdResponse.json();
    const deletedResponse = await request(`/${created.data.id}`, {
      method: "DELETE",
      roles: "gis-admin",
    });
    const deleted = await deletedResponse.json();
    const listResponse = await request("/");
    const listed = await listResponse.json();

    assert.equal(deletedResponse.status, 200);
    assert.equal(deleted.data.id, created.data.id);
    assert.deepEqual(listed.data.features, []);
  });
});
