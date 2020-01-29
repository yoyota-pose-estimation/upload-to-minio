const request = require("supertest")
const app = require("./app")

test("test root route", async () => {
  const res = await request(app).get("/")
  expect(res.status).toEqual(200)
})

test("test health route", async () => {
  const res = await request(app).get("/health")
  expect(res.status).toEqual(204)
})
