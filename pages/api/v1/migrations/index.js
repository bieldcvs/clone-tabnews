import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database.js";

export default async function migrations(req, res) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationsOptions = {
      dbClient: dbClient,
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "Table-migrations",
    };

    if (req.method == "GET") {
      const pendingMigrate = await migrationRunner(defaultMigrationsOptions);
      return res.status(200).json(pendingMigrate);
    }
    if (req.method == "POST") {
      const migrateMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });
      if (migrateMigrations.length > 0) {
        return res.status(201).json(migrateMigrations);
      }

      return res.status(200).json(migrateMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
