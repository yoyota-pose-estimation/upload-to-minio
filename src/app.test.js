const request = require("supertest")
const app = require("./app")

test("test root route", async () => {
  const res = await request(app).get("/")
  expect(res.status).toEqual(200)
})

test("test healthz route", async () => {
  const res = await request(app).get("/healthz")
  expect(res.status).toEqual(204)
})
