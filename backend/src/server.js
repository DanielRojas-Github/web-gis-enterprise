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

import {
  initializeOidcClient,
} from "./services/oidcClient.js";


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


      if (env.runMigrationsOnStart) {
        await runMigrations();
        console.log("Database migrations completed");
      } else {
        console.log(
          "Startup migrations disabled; run npm run migrate as a controlled step"
        );
      }

      await initializeOidcClient();

      if (env.auth.enabled) {
        console.log("OIDC authentication configured");
      } else {
        console.warn(
          "OIDC is not configured; API routes will remain unavailable"
        );
      }


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
