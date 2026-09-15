import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database.js";

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();
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
    await dbClient.end();
    return res.status(200).json(pendingMigrate);
  }
  if (req.method == "POST") {
    const migrateMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (migrateMigrations.length > 0) {
      return res.status(201).json(migrateMigrations);
    }

    return res.status(200).json(migrateMigrations);
  }
  return res.status(404).end();
}
