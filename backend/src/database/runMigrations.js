import fs
    from "fs";

import path
    from "path";

import crypto
    from "crypto";

import {
    fileURLToPath,
} from "url";

import {
    dbPool,
} from "../config/database.js";


const __filename =
    fileURLToPath(
        import.meta.url
    );

const __dirname =
    path.dirname(
        __filename
    );


const createChecksum = (
    content
) => {

    return crypto
        .createHash(
            "sha256"
        )
        .update(
            content
        )
        .digest(
            "hex"
        );

};


const ensureMigrationsTable =
    async () => {

        await dbPool.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                checksum VARCHAR(64),
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

    };


export const runMigrations =
    async () => {

        await ensureMigrationsTable();

        const migrationsDirectory =
            path.join(
                __dirname,
                "migrations"
            );

        const migrationFiles =
            fs
                .readdirSync(
                    migrationsDirectory
                )
                .filter(
                    (file) =>
                        file.endsWith(
                            ".sql"
                        )
                )
                .sort();


        for (
            const file
            of migrationFiles
        ) {

            const migrationPath =
                path.join(
                    migrationsDirectory,
                    file
                );

            const sql =
                fs.readFileSync(
                    migrationPath,
                    "utf8"
                );

            const checksum =
                createChecksum(
                    sql
                );


            const migrationCheck =
                await dbPool.query(
                    `
                        SELECT
                            id,
                            checksum
                        FROM schema_migrations
                        WHERE filename = $1
                    `,
                    [
                        file,
                    ]
                );


            if (
                migrationCheck.rowCount > 0
            ) {

                const migration =
                    migrationCheck.rows[0];


                if (
                    !migration.checksum
                ) {

                    await dbPool.query(
                        `
                            UPDATE schema_migrations
                            SET checksum = $1
                            WHERE id = $2
                        `,
                        [
                            checksum,
                            migration.id,
                        ]
                    );

                    continue;

                }


                if (
                    migration.checksum !==
                    checksum
                ) {

                    throw new Error(
                        `Migration checksum mismatch: ${file}`
                    );

                }


                continue;

            }


            const client =
                await dbPool.connect();


            try {

                await client.query(
                    "BEGIN"
                );

                await client.query(
                    sql
                );

                await client.query(
                    `
                        INSERT INTO schema_migrations (
                            filename,
                            checksum
                        )
                        VALUES ($1, $2)
                    `,
                    [
                        file,
                        checksum,
                    ]
                );

                await client.query(
                    "COMMIT"
                );

            } catch (error) {

                await client.query(
                    "ROLLBACK"
                );

                throw error;

            } finally {

                client.release();

            }

        }

    };