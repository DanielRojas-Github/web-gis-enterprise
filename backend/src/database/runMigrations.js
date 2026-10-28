import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

import {
  dbPool,
} from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A session-level PostgreSQL advisory lock serializes migration runs across
// backend processes without changing the historical migration files.
const MIGRATION_LOCK_KEY = [73190241, 1];

const createChecksum = (content) =>
  crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");

const ensureMigrationsTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      checksum VARCHAR(64),
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

export const runMigrations = async () => {
  const client = await dbPool.connect();
  let lockAcquired = false;

  try {
    await client.query(
      "SELECT pg_advisory_lock($1, $2)",
      MIGRATION_LOCK_KEY
    );
    lockAcquired = true;

    await ensureMigrationsTable(client);

    const migrationsDirectory = path.join(
      __dirname,
      "migrations"
    );

    const migrationFiles = fs
      .readdirSync(migrationsDirectory)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const migrationPath = path.join(
        migrationsDirectory,
        file
      );
      const sql = fs.readFileSync(migrationPath, "utf8");
      const checksum = createChecksum(sql);

      const migrationCheck = await client.query(
        `
          SELECT id, checksum
          FROM schema_migrations
          WHERE filename = $1
        `,
        [file]
      );

      if (migrationCheck.rowCount > 0) {
        const migration = migrationCheck.rows[0];

        if (!migration.checksum) {
          await client.query(
            `
              UPDATE schema_migrations
              SET checksum = $1
              WHERE id = $2
            `,
            [checksum, migration.id]
          );
          continue;
        }

        if (migration.checksum !== checksum) {
          throw new Error(
            `Migration checksum mismatch: ${file}`
          );
        }

        continue;
      }

      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query(
          `
            INSERT INTO schema_migrations (filename, checksum)
            VALUES ($1, $2)
          `,
          [file, checksum]
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    try {
      if (lockAcquired) {
        await client.query(
          "SELECT pg_advisory_unlock($1, $2)",
          MIGRATION_LOCK_KEY
        );
      }
    } finally {
      client.release();
    }
  }
};
