import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { randomUUID } from "node:crypto";

const databaseTestsEnabled =
  process.env.GIS_ALLOW_DB_TESTS === "true";

describe("Public facility PostGIS persistence", {
  skip: !databaseTestsEnabled,
}, () => {
  let dbPool;
  let repository;
  let facilityId;
  const uniqueName = `Automated test facility ${randomUUID()}`;

  before(async () => {
    const [{ env }, database, repositoryModule] = await Promise.all([
      import("../src/config/env.js"),
      import("../src/config/database.js"),
      import("../src/repositories/RepositoryFactory.js"),
    ]);

    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    if (!localHosts.has(env.db.host)) {
      throw new Error(
        "Database integration tests only run against a loopback host."
      );
    }

    dbPool = database.dbPool;
    repository = repositoryModule.RepositoryFactory.getRepository(
      "publicFacility"
    );
  });

  after(async () => {
    if (repository && facilityId !== undefined) {
      await repository.delete(facilityId);
    }

    if (dbPool) {
      await dbPool.end();
    }
  });

  it("persists, updates, reads, and deletes a facility in PostGIS", async () => {
    const created = await repository.create({
      name: uniqueName,
      facilityType: "library",
      status: "active",
      managingDepartment: "Automated tests",
      geometry: {
        type: "Point",
        coordinates: [-64.7296, -21.5355],
      },
    });
    facilityId = created.id;

    assert.equal(created.name, uniqueName);
    assert.deepEqual(created.geometry.coordinates, [-64.7296, -21.5355]);

    const persisted = await repository.findById(facilityId);
    assert.equal(persisted.name, uniqueName);
    assert.equal(persisted.facilityType, "library");

    const updated = await repository.update(facilityId, {
      name: `${uniqueName} updated`,
      facilityType: "library",
      status: "under_maintenance",
      managingDepartment: "Automated tests",
      geometry: {
        type: "Point",
        coordinates: [-64.72, -21.53],
      },
    });
    assert.equal(updated.name, `${uniqueName} updated`);
    assert.equal(updated.status, "under_maintenance");
    assert.deepEqual(updated.geometry.coordinates, [-64.72, -21.53]);

    const deleted = await repository.delete(facilityId);
    assert.equal(deleted.id, facilityId);
    facilityId = undefined;
    assert.equal(await repository.findById(deleted.id), null);
  });
});
