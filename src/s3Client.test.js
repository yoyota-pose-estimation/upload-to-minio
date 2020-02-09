/* eslint-disable global-require */
const mockClient = jest.fn()
jest.mock("minio", () => ({
  Client: mockClient
}))

describe("minio test", () => {
  const host = "localhost"
  const port = 9000
  const S3_ENDPOINT = `${host}:${port}`
  const AWS_ACCESS_KEY_ID = "accessKey"
  const AWS_SECRET_ACCESS_KEY = "secretKey"
  beforeEach(() => {
    process.env = {
      ...process.env,
      S3_ENDPOINT,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY
    }
    jest.resetModules()
  })

  afterEach(() => {
    mockClient.mockClear()
  })

  test("test key", async () => {
    require("./s3Client")
    expect(mockClient.mock.calls[0][0].accessKey).toBe(AWS_ACCESS_KEY_ID)
    expect(mockClient.mock.calls[0][0].secretKey).toBe(AWS_SECRET_ACCESS_KEY)
  })
  test("test endpoint", () => {
    require("./s3Client")
    expect(mockClient.mock.calls[0][0].endPoint).toBe(host)
  })
  test("test port", () => {
    require("./s3Client")
    expect(mockClient.mock.calls[0][0].port).toBe(port)
  })

  test("test use ssl == 1", () => {
    const S3_USE_HTTPS = "1"
    process.env = { ...process.env, S3_USE_HTTPS }
    require("./s3Client")
    expect(mockClient.mock.calls[0][0].useSSL).toBe(true)
  })

  test("test use ssl == 0", () => {
    const S3_USE_HTTPS = "0"
    process.env = { ...process.env, S3_USE_HTTPS }
    require("./s3Client")
    expect(mockClient.mock.calls[0][0].useSSL).toBe(false)
  })
})
