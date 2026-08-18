import database from "../../../../infra/database";

async function status(req, res) {
  const result = await database.query("SELECT 1 + 1 as SUM");
  console.log(result.database);
  res.status(200).json({ chave: "texto" });
}

export default status;
