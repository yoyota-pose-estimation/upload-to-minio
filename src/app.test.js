const mockPutObject = jest.fn()
jest.mock("minio", () => ({
  Client: jest.fn(() => ({
    putObject: mockPutObject
  }))
}))

const request = require("supertest")
const app = require("./app")

describe("file upload", () => {
  const testBucketName = "test-bucket"
  const section = "section"
  const filename = "test.txt"
  const buffer = Buffer.from("test content")

  afterEach(() => {
    mockPutObject.mockReset()
  })

  test("success", async () => {
    const res = await request(app)
      .post(`/${testBucketName}/${section}`)
      .attach("file", buffer, filename)
    expect(res.status).toBe(204)
    const [bucketName, objectName, stream] = mockPutObject.mock.calls[0]
    expect(bucketName).toBe(testBucketName)
    const re = new RegExp(
      `${section}/${"\\d{4}-\\d{2}-\\d{2}/\\d{2}"}/${filename}`
    )
    expect(objectName).toEqual(expect.stringMatching(re))
    expect(stream).toEqual(buffer)
  })

  test("on error", async () => {
    const errorMessage = "intended test error message"
    mockPutObject.mockImplementation(() => {
      throw new Error(errorMessage)
    })
    const res = await request(app)
      .post(`/${testBucketName}/${section}`)
      .attach("file", buffer, filename)
    expect(res.status).toBe(500)
    expect(res.text).toBe(`Error: ${errorMessage}`)
  })
})

test("test healthz route", async () => {
  const res = await request(app).get("/healthz")
  expect(res.status).toEqual(204)
})
