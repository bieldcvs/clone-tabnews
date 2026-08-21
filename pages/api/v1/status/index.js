import database from "infra/database";

async function status(req, res) {
  const updateAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseValorVersion = databaseVersionResult.rows[0].server_version;

  const connectMax = await database.query("SHOW max_connections;");

  const databaseName = process.env.POSTGRES_DB;
  const connectUsed = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  res.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseValorVersion,
        max_connections: parseInt(connectMax.rows[0].max_connections),
        used_connections: connectUsed.rows[0].count,
      },
    },
  });
}

export default status;
