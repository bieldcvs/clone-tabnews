import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations returns 200", async () => {
  const res1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(res1.status).toBe(201);

  const resBody = await res1.json();

  expect(Array.isArray(resBody)).toBe(true);
  expect(resBody.length).toBeGreaterThan(0);

  const res2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(res2.status).toBe(200);

  const resBody2 = await res2.json();

  expect(Array.isArray(resBody2)).toBe(true);
  expect(resBody2.length).toBe(0);
});
