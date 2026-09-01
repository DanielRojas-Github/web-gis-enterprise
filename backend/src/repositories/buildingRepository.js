import {
  dbPool,
} from "../config/database.js";


export class BuildingRepository {

  async findAll() {

    const result =
      await dbPool.query(`
        SELECT
          id,
          name,
          description,

          ST_AsGeoJSON(
            geom
          )::json AS geometry,

          ROUND(
            ST_Area(
              geom::geography
            )::numeric,
            2
          ) AS "areaSquareMeters",

          ROUND(
            ST_Perimeter(
              geom::geography
            )::numeric,
            2
          ) AS "perimeterMeters"

        FROM buildings

        ORDER BY id
      `);

    return result.rows;

  }

}