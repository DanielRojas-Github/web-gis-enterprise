import {
  dbPool,
} from "../config/database.js";

import {
  runMigrations,
} from "./runMigrations.js";

try {
  await runMigrations();
  console.log("Database migrations completed");
} catch (error) {
  console.error("Database migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await dbPool.end();
}
