import {
  Pool,
} from "pg";

import {
  env,
} from "./env.js";


export const dbPool =
  new Pool({

    host:
      env.db.host,

    port:
      env.db.port,

    database:
      env.db.name,

    user:
      env.db.user,

    password:
      env.db.password,

  });


export const testDatabaseConnection =
  async () => {

    const result =
      await dbPool.query(
        "SELECT NOW()"
      );

    return result.rows[0].now;

  };


export const testPostGIS =
  async () => {

    const result =
      await dbPool.query(
        "SELECT PostGIS_Version() AS version"
      );

    return result.rows[0].version;

  };