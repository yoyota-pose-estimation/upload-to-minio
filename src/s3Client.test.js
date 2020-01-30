const s3Client = require("./s3Client")

test("test s3 client", async () => {
  const buckets = await s3Client.listBuckets()
  expect(buckets).toBeInstanceOf(Array)
})
