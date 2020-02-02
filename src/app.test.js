const request = require("supertest")
const app = require("./app")
const s3Client = require("./s3Client")

const testBucketName = "test-bucket"

async function createTestBucket() {
  const buckets = await s3Client.listBuckets()
  const testBucket = buckets.find(({ name }) => name === testBucketName)
  if (!testBucket) {
    await s3Client.makeBucket(testBucketName)
  }
}

describe("upload test", () => {
  beforeAll(async () => {
    await createTestBucket()
  })

  test("test file upload", async () => {
    const testTxtContent = "test content"

    const res = await request(app)
      .post(`/${testBucketName}/section`)
      .attach("file", Buffer.from(testTxtContent), "test.txt")
    expect(res.status).toBe(204)

    const stream = await s3Client.getObject(
      testBucketName,
      `section/${new Date().toLocaleDateString("ko-KR")}/test.txt`
    )

    return new Promise((resolve, reject) => {
      const chunks = []
      stream.on("data", chunk => chunks.push(chunk))
      stream.on("error", reject)
      stream.on("end", () => {
        const content = Buffer.concat(chunks).toString("utf8")
        expect(content).toBe(testTxtContent)
        resolve()
      })
    })
  })

  test("test error handling", async () => {
    const res = await request(app).post(`/${testBucketName}/section`)
    expect(res.status).toBe(500)
    expect(res.text).toBe(
      "TypeError: Cannot destructure property `buffer` of 'undefined' or 'null'."
    )
  })
})

test("test healthz route", async () => {
  const res = await request(app).get("/healthz")
  expect(res.status).toEqual(204)
})
