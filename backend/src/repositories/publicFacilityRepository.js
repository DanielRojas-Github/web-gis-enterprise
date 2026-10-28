import {
  dbPool,
} from "../config/database.js";

export class PublicFacilityRepository {
  async findById(id) {
    const result = await dbPool.query(`
      SELECT
        id,
        name,
        facility_type AS "facilityType",
        status,
        managing_department AS "managingDepartment",
        ST_AsGeoJSON(geom)::json AS geometry
      FROM public_facilities
      WHERE id = $1
    `, [id]);

    return result.rows[0] ?? null;
  }

  async findAll() {
    const result = await dbPool.query(`
      SELECT
        id,
        name,
        facility_type AS "facilityType",
        status,
        managing_department AS "managingDepartment",
        ST_AsGeoJSON(geom)::json AS geometry
      FROM public_facilities
      ORDER BY name, id
    `);

    return result.rows;
  }

  async create(facility) {
    const result = await dbPool.query(`
      INSERT INTO public_facilities (
        name,
        facility_type,
        status,
        managing_department,
        geom
      ) VALUES (
        $1,
        $2,
        COALESCE($3, 'active'),
        $4,
        ST_SetSRID(ST_GeomFromGeoJSON($5), 4326)::geometry(Point, 4326)
      )
      RETURNING
        id,
        name,
        facility_type AS "facilityType",
        status,
        managing_department AS "managingDepartment",
        ST_AsGeoJSON(geom)::json AS geometry
    `, [
      facility.name.trim(),
      facility.facilityType,
      facility.status ?? null,
      facility.managingDepartment?.trim() || null,
      JSON.stringify(facility.geometry),
    ]);

    return result.rows[0];
  }

  async update(id, facility) {
    const result = await dbPool.query(`
      UPDATE public_facilities
      SET
        name = $2,
        facility_type = $3,
        status = $4,
        managing_department = $5,
        geom = ST_SetSRID(
          ST_GeomFromGeoJSON($6),
          4326
        )::geometry(Point, 4326),
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        name,
        facility_type AS "facilityType",
        status,
        managing_department AS "managingDepartment",
        ST_AsGeoJSON(geom)::json AS geometry
    `, [
      id,
      facility.name.trim(),
      facility.facilityType,
      facility.status ?? "active",
      facility.managingDepartment?.trim() || null,
      JSON.stringify(facility.geometry),
    ]);

    return result.rows[0] ?? null;
  }

  async delete(id) {
    const result = await dbPool.query(
      "DELETE FROM public_facilities WHERE id = $1 RETURNING id",
      [id]
    );

    return result.rows[0] ?? null;
  }
}
