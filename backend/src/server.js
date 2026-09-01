import app
  from "./app.js";

import {
  env,
} from "./config/env.js";

import {
  testDatabaseConnection,
  testPostGIS,
} from "./config/database.js";

import {
  runMigrations,
} from "./database/runMigrations.js";


const startServer =
  async () => {

    try {

      const timestamp =
        await testDatabaseConnection();

      console.log(
        "Database connected:",
        timestamp
      );


      const postGISVersion =
        await testPostGIS();

      console.log(
        "PostGIS connected:",
        postGISVersion
      );


      await runMigrations();

      console.log(
        "Database migrations completed"
      );


      app.listen(
        env.port,
        () => {

          console.log(
            `Server running on port ${env.port}`
          );

        }
      );

    } catch (error) {

      console.error(
        "Server startup failed:",
        error.message
      );

      process.exit(1);

    }

  };


startServer();