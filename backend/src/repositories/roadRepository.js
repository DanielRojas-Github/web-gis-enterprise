import {
  dbPool,
} from "../config/database.js";

export class RoadRepository {

  async findAll() {

    const result =
      await dbPool.query(`
        SELECT
      id,
      name,
      description,
      ST_AsGeoJSON(geom)::json AS geometry,
      ROUND(
        ST_Length(
          geom::geography
        )::numeric,
        2
      ) AS "lengthMeters"
    FROM roads
    ORDER BY id
      `);

    return result.rows;

  }

}